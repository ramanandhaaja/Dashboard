import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId, role, company_id } = session.user;

    // Build scoped query based on user role
    let query = supabase
      .from('dei_issues')
      .select(`
        id,
        user_id,
        offending_text,
        issue_type,
        user_action,
        trigger_type,
        auto_corrected,
        detected_at,
        document_name,
        source_app
      `)
      .order('detected_at', { ascending: false });

    // Check for super_admin user search filter
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('user_id');

    if (role === 'super_admin' && filterUserId) {
      // Super admin filtering by specific user
      query = query.eq('user_id', filterUserId);
    } else if (role === 'super_admin') {
      // Super admin with no filter: see all issues
      // No filter applied — returns everything
    } else {
      // Company member, owner, or individual user: see only their own issues
      query = query.eq('user_id', userId);
    }

    const { data: issues, error } = await query;

    if (error) {
      console.error('Error fetching DEI issues:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }

    // Fetch user information
    const userIds = [...new Set(issues?.map(issue => issue.user_id) || [])];
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, role')
      .in('id', userIds);

    // Create user lookup map
    const userMap = new Map(users?.map(user => [user.id, user]) || []);

    // Calculate analytics
    const totalIssues = issues?.length || 0;
    const uniqueUsers = userIds.length;

    // Calculate accuracy (accepted + auto_corrected / total)
    const successfulActions = issues?.filter(
      issue => issue.user_action === 'accepted' || issue.user_action === 'auto_corrected'
    ).length || 0;
    const avgAccuracy = totalIssues > 0 ? Math.round((successfulActions / totalIssues) * 100) : 0;

    // Check for client timezone early (used in multiple places)
    const clientTz = searchParams.get('tz') || 'UTC';
    const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: clientTz }); // en-CA gives YYYY-MM-DD

    // Get unique users active today (in client timezone)
    const todayStr = dayFormatter.format(new Date());
    const activeToday = new Set(
      issues?.filter(issue => dayFormatter.format(new Date(issue.detected_at)) === todayStr)
        .map(issue => issue.user_id) || []
    ).size;

    // Group issues by day for activity chart (in client timezone)
    const activityByDay = new Map<string, { analyses: number; corrections: number; reviews: number }>();

    issues?.forEach(issue => {
      const date = new Date(issue.detected_at);
      // Group by day in client timezone (YYYY-MM-DD format)
      const dayKey = dayFormatter.format(date);

      if (!activityByDay.has(dayKey)) {
        activityByDay.set(dayKey, { analyses: 0, corrections: 0, reviews: 0 });
      }

      const entry = activityByDay.get(dayKey)!;
      entry.analyses++;
      if (issue.user_action === 'accepted' || issue.user_action === 'auto_corrected') {
        entry.corrections++;
      }
      if (issue.trigger_type === 'manual') {
        entry.reviews++;
      }
    });

    const activityData = Array.from(activityByDay.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by issue type for department chart
    const issueTypeMap = new Map<string, number>();
    issues?.forEach(issue => {
      const count = issueTypeMap.get(issue.issue_type) || 0;
      issueTypeMap.set(issue.issue_type, count + 1);
    });

    const departmentData = Array.from(issueTypeMap.entries()).map(([name, count]) => ({
      name,
      users: uniqueUsers,
      totalAnalyses: count,
      avgAccuracy
    }));

    // Create heatmap data from all issues by day-of-week and hour
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const allHours = Array.from({ length: 18 }, (_, i) => {
      const h = i + 6; // 6 AM to 11 PM
      const period = h >= 12 ? 'PM' : 'AM';
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display} ${period}`;
    });

    const heatmapMap = new Map<string, number>();
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      hour: 'numeric',
      hour12: false,
      timeZone: clientTz,
    });
    issues?.forEach(issue => {
      const date = new Date(issue.detected_at);
      if (isNaN(date.getTime())) return;
      const parts = tzFormatter.formatToParts(date);
      const localDay = parts.find(p => p.type === 'weekday')?.value || '';
      const localHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
      if (localHour >= 6 && localHour <= 23) {
        const period = localHour >= 12 ? 'PM' : 'AM';
        const display = localHour > 12 ? localHour - 12 : localHour === 0 ? 12 : localHour;
        const hourLabel = `${display} ${period}`;
        const key = `${localDay}|${hourLabel}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      }
    });

    const heatmapData: { day: string; hour: string; value: number }[] = [];
    allDays.forEach(day => {
      allHours.forEach(hour => {
        const key = `${day}|${hour}`;
        heatmapData.push({ day, hour, value: heatmapMap.get(key) || 0 });
      });
    });

    // Source breakdown (Word vs Outlook vs Teams)
    const sourceMap = new Map<string, number>();
    issues?.forEach(issue => {
      const source = issue.source_app || 'word';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    const sourceBreakdown = ['word', 'outlook'].map(source => ({
      source,
      count: sourceMap.get(source) || 0,
    }));

    // Top performers
    const userStats = new Map<string, { analyses: number; accepted: number }>();
    issues?.forEach(issue => {
      if (!userStats.has(issue.user_id)) {
        userStats.set(issue.user_id, { analyses: 0, accepted: 0 });
      }
      const stats = userStats.get(issue.user_id)!;
      stats.analyses++;
      if (issue.user_action === 'accepted' || issue.user_action === 'auto_corrected') {
        stats.accepted++;
      }
    });

    const topPerformers = Array.from(userStats.entries())
      .map(([userId, stats]) => {
        const user = userMap.get(userId);
        return {
          id: userId,
          name: user?.name || 'Unknown User',
          department: user?.role === 'individual' ? 'Guest' : 'Employee',
          totalAnalyses: stats.analyses,
          accuracy: stats.analyses > 0 ? Math.round((stats.accepted / stats.analyses) * 100) : 0,
          avgResponseTime: '5.2 min',
          trend: 'up' as const
        };
      })
      .sort((a, b) => b.totalAnalyses - a.totalAnalyses);

    return NextResponse.json({
      overview: {
        totalAnalyses: totalIssues,
        totalUsers: uniqueUsers,
        avgAccuracy,
        activeToday
      },
      activityData,
      sourceBreakdown,
      departmentData,
      heatmapData,
      topPerformers,
      engagementMetrics: {
        dailyActiveUsers: activeToday,
        weeklyActiveUsers: uniqueUsers, // TODO: Calculate properly
        monthlyActiveUsers: uniqueUsers, // TODO: Calculate properly
        avgSessionDuration: '1.2 hours' // TODO: Calculate properly
      }
    });

  } catch (error) {
    console.error('Unexpected error in guest analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

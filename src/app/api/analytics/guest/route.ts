import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all DEI issues for guest users
    const { data: issues, error } = await supabase
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
        document_name
      `)
      .order('detected_at', { ascending: false });

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

    // Get unique users active today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = new Set(
      issues?.filter(issue => new Date(issue.detected_at) >= today)
        .map(issue => issue.user_id) || []
    ).size;

    // Group issues by day for activity chart (not hour)
    const activityByDay = new Map<string, { analyses: number; corrections: number; reviews: number }>();

    issues?.forEach(issue => {
      const date = new Date(issue.detected_at);
      // Group by day only (YYYY-MM-DD format)
      const dayKey = date.toISOString().split('T')[0];

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

    // Create heatmap data - must match component's expected days and hours
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const validHours = ['9 AM', '10 AM', '11 AM', '2 PM', '3 PM'];
    const hourMapping: Record<number, string> = {
      9: '9 AM', 10: '10 AM', 11: '11 AM', 14: '2 PM', 15: '3 PM'
    };

    const heatmapMap = new Map<string, number>();
    issues?.forEach(issue => {
      const date = new Date(issue.detected_at);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = dayNames[date.getDay()];
      const hour = date.getHours();
      const hourLabel = hourMapping[hour];

      // Only include weekdays and valid hours
      if (validDays.includes(day) && hourLabel) {
        const key = `${day}|${hourLabel}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      }
    });

    // Generate heatmap data for all valid day/hour combinations
    const heatmapData: { day: string; hour: string; value: number }[] = [];
    validDays.forEach(day => {
      validHours.forEach(hour => {
        const key = `${day}|${hour}`;
        heatmapData.push({ day, hour, value: heatmapMap.get(key) || 0 });
      });
    });

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

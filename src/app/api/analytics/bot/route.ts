import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const EMPTY_BOT_RESPONSE = {
  overview: { totalAnalyses: 0, totalUsers: 0, avgAccuracy: 0, activeToday: 0 },
  activityData: [],
  departmentData: [],
  heatmapData: [],
  topPerformers: [],
  topDetectedWords: [],
  engagementMetrics: {
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    avgSessionDuration: 'N/A',
  },
};

export async function GET(request: Request) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, company_id } = session.user;

    // Individual users without a company have no bot analytics (super_admin sees all)
    if (role !== 'super_admin' && !company_id) {
      return NextResponse.json(EMPTY_BOT_RESPONSE);
    }

    // Check for super_admin user filter
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('user_id');

    // If filtering by user, look up their name to match against sender_name
    let filterSenderName: string | null = null;
    if (role === 'super_admin' && filterUserId) {
      const { data: filterUser } = await supabase
        .from('users')
        .select('name')
        .eq('id', filterUserId)
        .single();
      filterSenderName = filterUser?.name || null;
    }

    // Fetch DEI word detections from Teams bot
    let botQuery = supabase
      .from('dei_words_teams')
      .select(`
        id,
        word,
        category,
        team_id,
        team_name,
        channel_id,
        channel_name,
        user_id_hash,
        sender_name,
        context_snippet,
        confidence_score,
        explanation,
        suggested_alternative,
        timestamp,
        created_at
      `)
      .order('timestamp', { ascending: false });

    if (role === 'super_admin' && filterSenderName) {
      // Super admin filtering by specific user's sender name
      botQuery = botQuery.ilike('sender_name', filterSenderName);
    }
    // super_admin without filter sees all, company users also see all (for now)

    const { data: detections, error } = await botQuery;

    if (error) {
      console.error('Error fetching DEI words from Teams:', error);
      return NextResponse.json({ error: 'Failed to fetch bot analytics data' }, { status: 500 });
    }

    // Calculate analytics
    const totalDetections = detections?.length || 0;
    const uniqueTeams = new Set(detections?.map(d => d.team_id) || []);
    const totalTeams = uniqueTeams.size;

    // Calculate average confidence score
    const avgConfidence = totalDetections > 0
      ? Math.round(
          (detections?.reduce((sum, d) => sum + (d.confidence_score || 0), 0) || 0) / totalDetections * 100
        )
      : 0;

    // Get unique teams active today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = new Set(
      detections?.filter(d => new Date(d.timestamp) >= today)
        .map(d => d.team_id) || []
    ).size;

    // Group detections by day for activity chart
    const activityByDay = new Map<string, { analyses: number; corrections: number; reviews: number }>();

    detections?.forEach(detection => {
      const date = new Date(detection.timestamp);
      const dayKey = date.toISOString().split('T')[0];

      if (!activityByDay.has(dayKey)) {
        activityByDay.set(dayKey, { analyses: 0, corrections: 0, reviews: 0 });
      }

      const entry = activityByDay.get(dayKey)!;
      entry.analyses++;
      if (detection.suggested_alternative) {
        entry.corrections++;
      }
    });

    const activityData = Array.from(activityByDay.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by category for department chart (reusing component)
    const categoryMap = new Map<string, number>();
    detections?.forEach(detection => {
      const category = detection.category || 'Unknown';
      const count = categoryMap.get(category) || 0;
      categoryMap.set(category, count + 1);
    });

    const departmentData = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      users: totalTeams,
      totalAnalyses: count,
      avgAccuracy: avgConfidence
    }));

    // Create heatmap data from all detections by day-of-week and hour
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allHours = Array.from({ length: 18 }, (_, i) => {
      const h = i + 6; // 6 AM to 11 PM
      const period = h >= 12 ? 'PM' : 'AM';
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display} ${period}`;
    });

    const heatmapMap = new Map<string, number>();
    detections?.forEach(detection => {
      const date = new Date(detection.timestamp);
      const day = dayNames[date.getDay()];
      const hour = date.getHours();
      if (hour >= 6 && hour <= 23) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const hourLabel = `${display} ${period}`;
        const key = `${day}|${hourLabel}`;
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

    // Top performers (teams with most detections)
    const teamStats = new Map<string, { detections: number; teamName: string; channels: Set<string> }>();
    detections?.forEach(detection => {
      if (!teamStats.has(detection.team_id)) {
        teamStats.set(detection.team_id, {
          detections: 0,
          teamName: detection.team_name || 'Unknown Team',
          channels: new Set()
        });
      }
      const stats = teamStats.get(detection.team_id)!;
      stats.detections++;
      if (detection.channel_name) {
        stats.channels.add(detection.channel_name);
      }
    });

    const topPerformers = Array.from(teamStats.entries())
      .map(([teamId, stats]) => ({
        id: teamId,
        name: stats.teamName,
        department: `${stats.channels.size} channel${stats.channels.size !== 1 ? 's' : ''}`,
        totalAnalyses: stats.detections,
        accuracy: avgConfidence,
        avgResponseTime: 'Real-time',
        trend: 'up' as const
      }))
      .sort((a, b) => b.totalAnalyses - a.totalAnalyses)
      .slice(0, 10);

    // Calculate top detected words
    const wordCountMap = new Map<string, number>();
    detections?.forEach(detection => {
      if (detection.word) {
        const word = detection.word.toLowerCase();
        wordCountMap.set(word, (wordCountMap.get(word) || 0) + 1);
      }
    });

    const topDetectedWords = Array.from(wordCountMap.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate engagement metrics
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const dailyActiveTeams = new Set(
      detections?.filter(d => now.getTime() - new Date(d.timestamp).getTime() < oneDay)
        .map(d => d.team_id) || []
    ).size;

    const weeklyActiveTeams = new Set(
      detections?.filter(d => now.getTime() - new Date(d.timestamp).getTime() < oneWeek)
        .map(d => d.team_id) || []
    ).size;

    const monthlyActiveTeams = new Set(
      detections?.filter(d => now.getTime() - new Date(d.timestamp).getTime() < oneMonth)
        .map(d => d.team_id) || []
    ).size;

    return NextResponse.json({
      overview: {
        totalAnalyses: totalDetections,
        totalUsers: totalTeams,
        avgAccuracy: avgConfidence,
        activeToday
      },
      activityData,
      departmentData,
      heatmapData,
      topPerformers,
      topDetectedWords,
      engagementMetrics: {
        dailyActiveUsers: dailyActiveTeams,
        weeklyActiveUsers: weeklyActiveTeams,
        monthlyActiveUsers: monthlyActiveTeams,
        avgSessionDuration: 'Real-time'
      }
    });

  } catch (error) {
    console.error('Unexpected error in bot analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

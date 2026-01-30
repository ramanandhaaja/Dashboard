import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all DEI word detections from Teams bot
    const { data: detections, error } = await supabase
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
        context_snippet,
        confidence_score,
        explanation,
        suggested_alternative,
        timestamp,
        created_at
      `)
      .order('timestamp', { ascending: false });

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

    // Group detections by hour for activity chart
    const activityByHour = new Map<string, { analyses: number; corrections: number; reviews: number }>();

    detections?.forEach(detection => {
      const date = new Date(detection.timestamp);
      const hourKey = `${date.toISOString().split('T')[0]} ${date.getHours().toString().padStart(2, '0')}:00`;

      if (!activityByHour.has(hourKey)) {
        activityByHour.set(hourKey, { analyses: 0, corrections: 0, reviews: 0 });
      }

      const entry = activityByHour.get(hourKey)!;
      entry.analyses++;
      // Bot detections are all "analyses", corrections would be if user applied suggestion
      if (detection.suggested_alternative) {
        entry.corrections++;
      }
    });

    const activityData = Array.from(activityByHour.entries())
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

    // Create heatmap data - must match component's expected days and hours
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const validHours = ['9 AM', '10 AM', '11 AM', '2 PM', '3 PM'];
    const hourMapping: Record<number, string> = {
      9: '9 AM', 10: '10 AM', 11: '11 AM', 14: '2 PM', 15: '3 PM'
    };

    const heatmapMap = new Map<string, number>();
    detections?.forEach(detection => {
      const date = new Date(detection.timestamp);
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

'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/lib/query-client';
import type { ActivityDataPoint } from '@/components/analytics/user-activity-chart';
import type { DepartmentData } from '@/components/analytics/department-comparison-chart';
import type { HeatmapData } from '@/components/analytics/activity-heatmap';
import type { Performer } from '@/components/analytics/top-performers-table';

/**
 * Bot analytics data structure returned by the API.
 * Mirrors GuestAnalyticsData for component compatibility.
 */
export interface DetectedWord {
  word: string;
  count: number;
}

export interface BotAnalyticsData {
  overview: {
    totalAnalyses: number;  // Total DEI word detections
    totalUsers: number;     // Total unique teams
    avgAccuracy: number;    // Average confidence score (%)
    activeToday: number;    // Teams active today
  };
  activityData: ActivityDataPoint[];
  departmentData: DepartmentData[];  // Actually category data
  heatmapData: HeatmapData[];
  topPerformers: Performer[];  // Top teams by detection count
  topDetectedWords: DetectedWord[];  // Top 10 most detected DE&I words
  engagementMetrics: {
    dailyActiveUsers: number;   // Daily active teams
    weeklyActiveUsers: number;  // Weekly active teams
    monthlyActiveUsers: number; // Monthly active teams
    avgSessionDuration: string;
  };
}

async function fetchBotAnalytics(filterTeamId?: string | null): Promise<BotAnalyticsData> {
  const params = filterTeamId ? `?team_id=${filterTeamId}` : '';
  const response = await fetch(`/api/analytics/bot${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch bot analytics data');
  }

  return response.json();
}

/**
 * Custom hook for fetching and caching Teams bot analytics data.
 * Super admins can pass a filterTeamId to view a specific team's data.
 */
export function useBotAnalytics(filterTeamId?: string | null) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const cacheKey = filterTeamId || userId || '';

  return useQuery({
    queryKey: queryKeys.analytics.bot(cacheKey),
    queryFn: () => fetchBotAnalytics(filterTeamId),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}

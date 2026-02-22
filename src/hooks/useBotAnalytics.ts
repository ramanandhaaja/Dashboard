'use client';

import { useQuery } from '@tanstack/react-query';
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

async function fetchBotAnalytics(filterUserId?: string | null): Promise<BotAnalyticsData> {
  const params = filterUserId ? `?user_id=${filterUserId}` : '';
  const response = await fetch(`/api/analytics/bot${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch bot analytics data');
  }

  return response.json();
}

/**
 * Custom hook for fetching and caching Teams bot analytics data.
 * Super admins can pass a filterUserId to view a specific user's data.
 */
export function useBotAnalytics(filterUserId?: string | null) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  // undefined = non-super_admin (use own userId), null = super_admin no filter (show all), string = filtered
  const cacheKey = filterUserId === undefined ? (userId || '') : (filterUserId || 'all');

  return useQuery({
    queryKey: queryKeys.analytics.bot(cacheKey),
    queryFn: () => fetchBotAnalytics(filterUserId),
    enabled: !!userId,
  });
}

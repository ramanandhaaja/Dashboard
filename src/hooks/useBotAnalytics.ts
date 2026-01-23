'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import type { ActivityDataPoint } from '@/components/analytics/user-activity-chart';
import type { DepartmentData } from '@/components/analytics/department-comparison-chart';
import type { HeatmapData } from '@/components/analytics/activity-heatmap';
import type { Performer } from '@/components/analytics/top-performers-table';

/**
 * Bot analytics data structure returned by the API.
 * Mirrors GuestAnalyticsData for component compatibility.
 */
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
  engagementMetrics: {
    dailyActiveUsers: number;   // Daily active teams
    weeklyActiveUsers: number;  // Weekly active teams
    monthlyActiveUsers: number; // Monthly active teams
    avgSessionDuration: string;
  };
}

/**
 * Fetches bot analytics data from the API.
 *
 * @throws Error if the API request fails
 */
async function fetchBotAnalytics(): Promise<BotAnalyticsData> {
  const response = await fetch('/api/analytics/bot');

  if (!response.ok) {
    throw new Error('Failed to fetch bot analytics data');
  }

  return response.json();
}

/**
 * Custom hook for fetching and caching Teams bot analytics data.
 *
 * Features:
 * - Automatic caching (5-minute stale time)
 * - Background refetching when data becomes stale
 * - Automatic retry on failure (1 attempt)
 * - Type-safe data access
 *
 * @example
 * ```tsx
 * function BotAnalyticsPage() {
 *   const { data, isLoading, isError, error, refetch } = useBotAnalytics();
 *
 *   if (isLoading) return <Loading />;
 *   if (isError) return <Error message={error.message} />;
 *
 *   return <Dashboard data={data} />;
 * }
 * ```
 */
export function useBotAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.bot(),
    queryFn: fetchBotAnalytics,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import type { ActivityDataPoint } from '@/components/analytics/user-activity-chart';
import type { DepartmentData } from '@/components/analytics/department-comparison-chart';
import type { HeatmapData } from '@/components/analytics/activity-heatmap';
import type { Performer } from '@/components/analytics/top-performers-table';

/**
 * Guest analytics data structure returned by the API.
 */
export interface GuestAnalyticsData {
  overview: {
    totalAnalyses: number;
    totalUsers: number;
    avgAccuracy: number;
    activeToday: number;
  };
  activityData: ActivityDataPoint[];
  departmentData: DepartmentData[];
  heatmapData: HeatmapData[];
  topPerformers: Performer[];
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSessionDuration: string;
  };
}

/**
 * Fetches guest analytics data from the API.
 *
 * @throws Error if the API request fails
 */
async function fetchGuestAnalytics(): Promise<GuestAnalyticsData> {
  const response = await fetch('/api/analytics/guest');

  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return response.json();
}

/**
 * Custom hook for fetching and caching guest analytics data.
 *
 * Features:
 * - Automatic caching (5-minute stale time)
 * - Background refetching when data becomes stale
 * - Automatic retry on failure (1 attempt)
 * - Type-safe data access
 *
 * @example
 * ```tsx
 * function GuestAnalyticsPage() {
 *   const { data, isLoading, isError, error, refetch } = useGuestAnalytics();
 *
 *   if (isLoading) return <Loading />;
 *   if (isError) return <Error message={error.message} />;
 *
 *   return <Dashboard data={data} />;
 * }
 * ```
 */
export function useGuestAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.guest(),
    queryFn: fetchGuestAnalytics,
  });
}

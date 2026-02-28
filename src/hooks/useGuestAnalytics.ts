'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/lib/query-client';
import type { ActivityDataPoint } from '@/components/analytics/user-activity-chart';
import type { SourceBreakdownData } from '@/components/analytics/source-breakdown-chart';
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
  sourceBreakdown: SourceBreakdownData[];
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

async function fetchGuestAnalytics(filterUserId?: string | null): Promise<GuestAnalyticsData> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const searchParams = new URLSearchParams();
  if (filterUserId) searchParams.set('user_id', filterUserId);
  searchParams.set('tz', tz);
  const params = `?${searchParams.toString()}`;
  const response = await fetch(`/api/analytics/guest${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return response.json();
}

/**
 * Custom hook for fetching and caching guest analytics data.
 * Super admins can pass a filterUserId to view a specific user's data.
 */
export function useGuestAnalytics(filterUserId?: string | null) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  // Use filterUserId in query key so each filter gets its own cache
  // undefined = non-super_admin (use own userId), null = super_admin no filter (show all), string = filtered
  const cacheKey = filterUserId === undefined ? (userId || '') : (filterUserId || 'all');

  return useQuery({
    queryKey: queryKeys.analytics.guest(cacheKey),
    queryFn: () => fetchGuestAnalytics(filterUserId),
    enabled: !!userId,
  });
}

'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/lib/query-client';
import type { DashboardAnalyticsData, DashboardScope, DashboardFilters } from '@/types/analytics';

/**
 * Fetches Phase 1 KPI analytics data from /api/analytics/dashboard.
 */
async function fetchDashboardAnalytics(
  scope: DashboardScope,
  filters?: DashboardFilters
): Promise<DashboardAnalyticsData> {
  const params = new URLSearchParams({ scope });
  if (filters?.companyId) params.set('company_id', filters.companyId);
  if (filters?.userId) params.set('user_id', filters.userId);

  const response = await fetch(`/api/analytics/dashboard?${params}`);
  if (!response.ok) throw new Error('Failed to fetch dashboard analytics');
  return response.json();
}

/**
 * Unified hook for fetching Phase 1 KPI dashboard analytics.
 */
export function useDashboardAnalytics(scope: DashboardScope, filters?: DashboardFilters) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: queryKeys.analytics.dashboard(scope, filters as Record<string, string>),
    queryFn: () => fetchDashboardAnalytics(scope, filters),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}

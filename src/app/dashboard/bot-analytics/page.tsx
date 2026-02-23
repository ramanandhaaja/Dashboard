'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useBotAnalytics } from '@/hooks/useBotAnalytics';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useExportCSV } from '@/hooks/useExportCSV';
import { useExportPDF } from '@/hooks/useExportPDF';
import { HeroMetrics } from '@/components/analytics/hero-metrics';
import { ModulePerformanceTiles } from '@/components/analytics/module-performance-tiles';
import { ExportButton } from '@/components/analytics/export-button';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { UserActivityChart } from '@/components/analytics/user-activity-chart';
import { DepartmentComparisonChart } from '@/components/analytics/department-comparison-chart';
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap';
import { EngagementMetrics } from '@/components/analytics/engagement-metrics';
import { TopDetectedWords } from '@/components/analytics/top-detected-words';
import { UserSearchFilter, type SelectedUser } from '@/components/analytics/user-search-filter';
import { RefreshCw } from 'lucide-react';

export default function BotAnalyticsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === 'super_admin';
  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [filteredUser, setFilteredUser] = useState<SelectedUser | null>(null);

  // Existing issue-level data
  const { data, isLoading, isError, error, refetch, isFetching } = useBotAnalytics(
    isSuperAdmin ? filterUserId : undefined
  );

  // New Phase 1 KPI data (hero metrics + modules)
  const { data: kpiData } = useDashboardAnalytics(
    'bot',
    isSuperAdmin && filterUserId ? { userId: filterUserId } : undefined
  );

  const { trigger: exportCSV, isExporting: isExportingCSV } = useExportCSV('bot');
  const { trigger: exportPDF, isExporting: isExportingPDF } = useExportPDF();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams Analytics</h1>
            <p className="text-muted-foreground mt-1">DEI detection insights from Teams bot</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading analytics data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams Analytics</h1>
            <p className="text-muted-foreground mt-1">DEI detection insights from Teams bot</p>
          </div>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-red-500">
              {error instanceof Error ? error.message : 'Failed to load analytics data'}
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams Analytics</h1>
            <p className="text-muted-foreground mt-1">
              {filteredUser
                ? `Viewing data for: ${filteredUser.name} (${filteredUser.email})`
                : 'DEI detection insights from Teams bot'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {kpiData && (
              <ExportButton
                onExportPDF={() => exportPDF(kpiData)}
                onExportCSV={exportCSV}
                isExporting={isExportingCSV || isExportingPDF}
              />
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Super Admin: User Search Filter */}
        {isSuperAdmin && (
          <UserSearchFilter
            onUserSelect={(userId, user) => {
              setFilterUserId(userId);
              setFilteredUser(user);
            }}
          />
        )}

        {/* Loading overlay when switching users */}
        {isFetching && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading data{filteredUser ? ` for ${filteredUser.name}` : ''}...</span>
            </div>
          </div>
        )}

        {!isFetching && (
          <>
            {/* Phase 1 KPI: Hero Metrics */}
            {kpiData && <HeroMetrics data={kpiData.heroMetrics} />}

            {/* Phase 1 KPI: Module Performance Tiles */}
            {kpiData && <ModulePerformanceTiles data={kpiData.modules} />}

            {/* Analytics Overview - Detections, Teams, Confidence, Active Today */}
            <AnalyticsOverview
              totalAnalyses={data.overview.totalAnalyses}
              totalUsers={data.overview.totalUsers}
              avgAccuracy={data.overview.avgAccuracy}
              activeToday={data.overview.activeToday}
            />

            {/* Detection Activity Chart & Top Detected Words */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UserActivityChart data={data.activityData} showCorrections={false} showReviews={false} />
              </div>
              <TopDetectedWords words={data.topDetectedWords} />
            </div>

            {/* Category Breakdown & Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentComparisonChart data={data.departmentData} />
              <EngagementMetrics
                dailyActiveUsers={data.engagementMetrics.dailyActiveUsers}
                weeklyActiveUsers={data.engagementMetrics.weeklyActiveUsers}
                monthlyActiveUsers={data.engagementMetrics.monthlyActiveUsers}
                avgSessionDuration={data.engagementMetrics.avgSessionDuration}
              />
            </div>

            {/* Activity Heatmap - Shows when detections occurred */}
            <ActivityHeatmap data={data.heatmapData} />
          </>
        )}
      </div>
    </div>
  );
}

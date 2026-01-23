'use client';

import { useBotAnalytics } from '@/hooks/useBotAnalytics';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { UserActivityChart } from '@/components/analytics/user-activity-chart';
import { DepartmentComparisonChart } from '@/components/analytics/department-comparison-chart';
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap';
import { TopPerformersTable } from '@/components/analytics/top-performers-table';
import { EngagementMetrics } from '@/components/analytics/engagement-metrics';
import { RefreshCw } from 'lucide-react';

export default function BotAnalyticsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useBotAnalytics();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bot Analytics</h1>
            <p className="text-muted-foreground mt-1">Teams bot DEI detection insights</p>
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
            <h1 className="text-3xl font-bold text-foreground">Bot Analytics</h1>
            <p className="text-muted-foreground mt-1">Teams bot DEI detection insights</p>
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
        {/* Page Header with Refresh Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bot Analytics</h1>
            <p className="text-muted-foreground mt-1">Real-time DEI detection from Teams bot</p>
          </div>
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

        {/* Analytics Overview - Detections, Teams, Confidence, Active Today */}
        <AnalyticsOverview
          totalAnalyses={data.overview.totalAnalyses}
          totalUsers={data.overview.totalUsers}
          avgAccuracy={data.overview.avgAccuracy}
          activeToday={data.overview.activeToday}
        />

        {/* Detection Activity Chart */}
        <UserActivityChart data={data.activityData} />

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

        {/* Top Teams Table */}
        <TopPerformersTable performers={data.topPerformers} />
      </div>
    </div>
  );
}

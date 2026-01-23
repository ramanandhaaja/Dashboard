'use client';

import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { UserActivityChart, type ActivityDataPoint } from '@/components/analytics/user-activity-chart';
import { DepartmentComparisonChart, type DepartmentData } from '@/components/analytics/department-comparison-chart';
import { ActivityHeatmap, type HeatmapData } from '@/components/analytics/activity-heatmap';
import { TopPerformersTable, type Performer } from '@/components/analytics/top-performers-table';
import { EngagementMetrics } from '@/components/analytics/engagement-metrics';

// Mock data
const mockActivityData: ActivityDataPoint[] = [
  { date: '2025-01-01', analyses: 45, corrections: 32, reviews: 28 },
  { date: '2025-01-02', analyses: 52, corrections: 38, reviews: 31 },
  { date: '2025-01-03', analyses: 48, corrections: 35, reviews: 29 },
  { date: '2025-01-04', analyses: 61, corrections: 42, reviews: 35 },
  { date: '2025-01-05', analyses: 55, corrections: 40, reviews: 33 },
  { date: '2025-01-06', analyses: 58, corrections: 41, reviews: 36 },
  { date: '2025-01-07', analyses: 67, corrections: 48, reviews: 40 },
];

const mockDepartmentData: DepartmentData[] = [
  { name: 'HR', users: 12, totalAnalyses: 450, avgAccuracy: 92 },
  { name: 'Legal', users: 8, totalAnalyses: 380, avgAccuracy: 95 },
  { name: 'Marketing', users: 15, totalAnalyses: 520, avgAccuracy: 88 },
  { name: 'Sales', users: 20, totalAnalyses: 610, avgAccuracy: 85 },
  { name: 'Operations', users: 10, totalAnalyses: 290, avgAccuracy: 90 },
];

const mockHeatmapData: HeatmapData[] = [
  { day: 'Monday', hour: '9 AM', value: 45 },
  { day: 'Monday', hour: '10 AM', value: 62 },
  { day: 'Monday', hour: '11 AM', value: 58 },
  { day: 'Monday', hour: '2 PM', value: 51 },
  { day: 'Monday', hour: '3 PM', value: 47 },
  { day: 'Tuesday', hour: '9 AM', value: 52 },
  { day: 'Tuesday', hour: '10 AM', value: 68 },
  { day: 'Tuesday', hour: '11 AM', value: 64 },
  { day: 'Tuesday', hour: '2 PM', value: 55 },
  { day: 'Tuesday', hour: '3 PM', value: 49 },
  { day: 'Wednesday', hour: '9 AM', value: 48 },
  { day: 'Wednesday', hour: '10 AM', value: 65 },
  { day: 'Wednesday', hour: '11 AM', value: 61 },
  { day: 'Wednesday', hour: '2 PM', value: 58 },
  { day: 'Wednesday', hour: '3 PM', value: 52 },
  { day: 'Thursday', hour: '9 AM', value: 55 },
  { day: 'Thursday', hour: '10 AM', value: 71 },
  { day: 'Thursday', hour: '11 AM', value: 67 },
  { day: 'Thursday', hour: '2 PM', value: 60 },
  { day: 'Thursday', hour: '3 PM', value: 54 },
  { day: 'Friday', hour: '9 AM', value: 42 },
  { day: 'Friday', hour: '10 AM', value: 58 },
  { day: 'Friday', hour: '11 AM', value: 53 },
  { day: 'Friday', hour: '2 PM', value: 38 },
  { day: 'Friday', hour: '3 PM', value: 32 },
];

const mockTopPerformers: Performer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    department: 'Legal',
    totalAnalyses: 156,
    accuracy: 97,
    avgResponseTime: '2.3 min',
    trend: 'up',
  },
  {
    id: '2',
    name: 'Michael Chen',
    department: 'HR',
    totalAnalyses: 142,
    accuracy: 95,
    avgResponseTime: '2.8 min',
    trend: 'up',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    department: 'Marketing',
    totalAnalyses: 138,
    accuracy: 93,
    avgResponseTime: '3.1 min',
    trend: 'stable',
  },
  {
    id: '4',
    name: 'David Park',
    department: 'Sales',
    totalAnalyses: 135,
    accuracy: 91,
    avgResponseTime: '3.4 min',
    trend: 'up',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    department: 'Operations',
    totalAnalyses: 128,
    accuracy: 94,
    avgResponseTime: '2.9 min',
    trend: 'stable',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track company and user performance metrics</p>
        </div>

        {/* Analytics Overview */}
        <AnalyticsOverview
          totalAnalyses={2250}
          totalUsers={65}
          avgAccuracy={90}
          activeToday={42}
        />

        {/* User Activity Chart */}
        <UserActivityChart data={mockActivityData} />

        {/* Department Comparison & Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentComparisonChart data={mockDepartmentData} />
          <EngagementMetrics
            dailyActiveUsers={42}
            weeklyActiveUsers={58}
            monthlyActiveUsers={65}
            avgSessionDuration="18 min"
          />
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={mockHeatmapData} />

        {/* Top Performers Table */}
        <TopPerformersTable performers={mockTopPerformers} />
      </div>
    </div>
  );
}

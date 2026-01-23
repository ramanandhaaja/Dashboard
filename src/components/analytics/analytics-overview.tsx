'use client';

import { TrendingUp, Users, Target, Activity } from 'lucide-react';

interface AnalyticsOverviewProps {
  totalAnalyses: number;
  totalUsers: number;
  avgAccuracy: number;
  activeToday: number;
}

export function AnalyticsOverview({
  totalAnalyses,
  totalUsers,
  avgAccuracy,
  activeToday,
}: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">
          {totalAnalyses.toLocaleString()}
        </p>
        <p className="text-sm text-chart-3 mt-1">+12% from last month</p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
          <Users className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{totalUsers}</p>
        <p className="text-sm text-chart-3 mt-1">+3 new this month</p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
          <Target className="w-5 h-5 text-chart-3" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{avgAccuracy}%</p>
        <p className="text-sm text-chart-3 mt-1">+2% improvement</p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Active Today</p>
          <Activity className="w-5 h-5 text-secondary" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{activeToday}</p>
        <p className="text-sm text-muted-foreground mt-1">{((activeToday / totalUsers) * 100).toFixed(0)}% of total users</p>
      </div>
    </div>
  );
}

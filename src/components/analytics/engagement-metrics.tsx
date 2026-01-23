'use client';

import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';

interface EngagementMetricsProps {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: string;
}

export function EngagementMetrics({
  dailyActiveUsers,
  weeklyActiveUsers,
  monthlyActiveUsers,
  avgSessionDuration,
}: EngagementMetricsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Engagement Metrics</h2>
        <p className="text-sm text-gray-600">User activity and engagement statistics</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{dailyActiveUsers}</p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyActiveUsers}</p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyActiveUsers}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">100%</div>
        </div>

        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">{avgSessionDuration}</p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
      </div>
    </div>
  );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, Minus, Award } from 'lucide-react';

export interface Performer {
  id: string;
  name: string;
  department: string;
  totalAnalyses: number;
  accuracy: number;
  avgResponseTime: string;
  trend: 'up' | 'down' | 'stable';
}

interface TopPerformersTableProps {
  performers: Performer[];
}

export function TopPerformersTable({ performers }: TopPerformersTableProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600 bg-green-50';
    if (accuracy >= 90) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Highest performing users this month</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Analyses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Accuracy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Avg Response Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {performers.map((performer, index) => (
              <tr key={performer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 && (
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-indigo-600">
                        {performer.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="text-xs">
                    {performer.department}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{performer.totalAnalyses}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${getAccuracyColor(performer.accuracy)}`}>
                    {performer.accuracy}%
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{performer.avgResponseTime}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(performer.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

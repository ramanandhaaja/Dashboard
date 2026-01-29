'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface ActivityDataPoint {
  date: string;
  analyses: number;
  corrections: number;
  reviews: number;
}

interface UserActivityChartProps {
  data: ActivityDataPoint[];
  showCorrections?: boolean;
  showReviews?: boolean;
}

export function UserActivityChart({ data, showCorrections = true, showReviews = true }: UserActivityChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">User Activity Trends</h2>
        <p className="text-sm text-gray-600">Daily activity breakdown over the past week</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="analyses"
            stroke="#3b82f6"
            strokeWidth={2}
            name="DE&I Analyses"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          {showCorrections && (
            <Line
              type="monotone"
              dataKey="corrections"
              stroke="#10b981"
              strokeWidth={2}
              name="Corrections Applied"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
          {showReviews && (
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Reviews Completed"
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface UsageDataPoint {
  date: string;
  inputTokens: number;
  outputTokens: number;
  total: number;
}

interface UsageTrendChartProps {
  data: UsageDataPoint[];
}

export function UsageTrendChart({ data }: UsageTrendChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="inputTokens"
            stroke="#3b82f6"
            name="Input Tokens"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="outputTokens"
            stroke="#10b981"
            name="Output Tokens"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            name="Total"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

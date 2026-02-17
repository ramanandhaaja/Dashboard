'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AppBreakdownData } from '@/types/analytics';

interface AppBreakdownChartProps {
  data: AppBreakdownData;
}

export function AppBreakdownChart({ data }: AppBreakdownChartProps) {
  const chartData = [
    { app: 'Word', bias: data.word.biasCount, tone: data.word.toneCount, clarity: data.word.clarityCount },
    { app: 'Outlook', bias: data.outlook.biasCount, tone: data.outlook.toneCount, clarity: data.outlook.clarityCount },
    { app: 'Teams', bias: data.teams.biasCount, tone: data.teams.toneCount, clarity: data.teams.clarityCount },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Cross-App Detection</h2>
        <p className="text-sm text-muted-foreground">Module detections by application</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="app" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="bias" fill="#3b82f6" name="Bias" radius={[4, 4, 0, 0]} />
          <Bar dataKey="tone" fill="#8b5cf6" name="Tone" radius={[4, 4, 0, 0]} />
          <Bar dataKey="clarity" fill="#10b981" name="Clarity" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        {Object.entries(data).map(([app, counts]) => (
          <div key={app} className="text-center">
            <p className="text-lg font-bold text-foreground">{counts.totalCount}</p>
            <p className="text-xs text-muted-foreground capitalize">{app} total</p>
          </div>
        ))}
      </div>
    </div>
  );
}

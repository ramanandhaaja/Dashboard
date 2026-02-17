'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendData } from '@/types/analytics';

interface TrendAnalysisProps {
  data: TrendData;
}

function QuarterlyTargets({ targets }: { targets: TrendData['quarterlyTargets'] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Quarterly Targets</h3>
      {targets.map((target) => {
        const pct = Math.min(Math.round((target.current / target.target) * 100), 100);
        const barColor = pct >= 100 ? 'bg-green-500' : pct >= 75 ? 'bg-yellow-500' : 'bg-red-500';
        return (
          <div key={target.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">{target.name}</span>
              <span className="font-medium text-foreground">
                {target.current}{target.unit === '%' ? '%' : ''} / {target.target}{target.unit === '%' ? '%' : ''} ({pct}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TrendAnalysis({ data }: TrendAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly' | 'quarterly'>('monthly');

  const chartData = data.monthly.map((d) => ({
    ...d,
    period: d.period.replace(/^\d{4}-/, ''),
  }));

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Trend Analysis</h2>
          <p className="text-sm text-muted-foreground">Module score improvement over time</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-md p-0.5">
          {(['daily', 'monthly', 'quarterly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                timeRange === range
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="period" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[50, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="biasScore" stroke="#3b82f6" name="Bias" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="toneScore" stroke="#8b5cf6" name="Tone" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="clarityScore" stroke="#10b981" name="Clarity" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="overallScore" stroke="#6b7280" name="Overall" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      {data.monthly.length < 3 ? (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">More data needed for pattern detection</p>
        </div>
      ) : (
        <QuarterlyTargets targets={data.quarterlyTargets} />
      )}
    </div>
  );
}

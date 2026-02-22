'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface SourceBreakdownData {
  source: string;
  count: number;
}

interface SourceBreakdownChartProps {
  data: SourceBreakdownData[];
}

const SOURCE_COLORS: Record<string, string> = {
  word: '#2b579a',
  outlook: '#0078d4',
};

const SOURCE_LABELS: Record<string, string> = {
  word: 'Word',
  outlook: 'Outlook',
};

export function SourceBreakdownChart({ data }: SourceBreakdownChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: SOURCE_LABELS[d.source] || d.source,
      value: d.count,
      color: SOURCE_COLORS[d.source] || '#9ca3af',
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Issues by Source</h2>
        <p className="text-sm text-gray-600">Where DE&I issues are detected</p>
      </div>

      {total === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-sm text-gray-400">
          No issue data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(props: any) =>
                  `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`
                }
                style={{ fontSize: '12px' }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} issues`, 'Count']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {data.map((d) => (
              <div key={d.source} className="text-center rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">
                  {SOURCE_LABELS[d.source] || d.source}
                </p>
                <p className="text-lg font-semibold text-gray-900">{d.count}</p>
                <p className="text-xs text-gray-400">
                  {total > 0 ? `${Math.round((d.count / total) * 100)}%` : '0%'}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

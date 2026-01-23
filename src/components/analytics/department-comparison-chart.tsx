'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface DepartmentData {
  name: string;
  users: number;
  totalAnalyses: number;
  avgAccuracy: number;
}

interface DepartmentComparisonChartProps {
  data: DepartmentData[];
}

export function DepartmentComparisonChart({ data }: DepartmentComparisonChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
        <p className="text-sm text-gray-600">Total analyses and accuracy by department</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
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
          <Bar dataKey="totalAnalyses" fill="#3b82f6" name="Total Analyses" radius={[4, 4, 0, 0]} />
          <Bar dataKey="avgAccuracy" fill="#10b981" name="Avg Accuracy (%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.map((dept) => (
          <div key={dept.name} className="text-center">
            <p className="text-xs font-medium text-gray-600">{dept.name}</p>
            <p className="text-xs text-gray-500">{dept.users} users</p>
          </div>
        ))}
      </div>
    </div>
  );
}

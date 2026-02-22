'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface DepartmentData {
  name: string;
  users: number;
  totalAnalyses: number;
  avgAccuracy: number;
}

interface DepartmentComparisonChartProps {
  data: DepartmentData[];
}

const INITIAL_COUNT = 10;

export function DepartmentComparisonChart({ data }: DepartmentComparisonChartProps) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...data].sort((a, b) => b.totalAnalyses - a.totalAnalyses);
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hasMore = sorted.length > INITIAL_COUNT;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
          <p className="text-sm text-gray-600">
            Total analyses and accuracy by department
            {hasMore && !showAll && ` (top ${INITIAL_COUNT} of ${sorted.length})`}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visible}>
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
        {visible.map((dept) => (
          <div key={dept.name} className="text-center">
            <p className="text-xs font-medium text-gray-600">{dept.name}</p>
            <p className="text-xs text-gray-500">{dept.users} users</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 flex items-center gap-1 mx-auto text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showAll ? (
            <>Show Less <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Show More ({sorted.length - INITIAL_COUNT} more) <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      )}
    </div>
  );
}

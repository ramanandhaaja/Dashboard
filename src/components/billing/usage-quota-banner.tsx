'use client';

import { AlertTriangle } from 'lucide-react';

interface UsageQuotaBannerProps {
  currentUsage: number;
  quota: number;
}

export function UsageQuotaBanner({ currentUsage, quota }: UsageQuotaBannerProps) {
  const percentage = (currentUsage / quota) * 100;
  const isCritical = percentage >= 100;

  if (percentage < 80) {
    return null; // Don't show banner if under 80%
  }

  return (
    <div
      className={`rounded-lg p-4 mb-6 ${
        isCritical
          ? 'bg-red-50 border border-red-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {isCritical ? (
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        )}
        <div className="flex-1">
          <h4
            className={`font-semibold ${
              isCritical ? 'text-red-900' : 'text-yellow-900'
            }`}
          >
            {isCritical ? 'Quota Exceeded' : 'Approaching Quota Limit'}
          </h4>
          <p
            className={`text-sm mt-1 ${
              isCritical ? 'text-red-700' : 'text-yellow-700'
            }`}
          >
            You&apos;ve used {currentUsage.toLocaleString()} of {quota.toLocaleString()} tokens (
            {percentage.toFixed(1)}%).
            {isCritical
              ? ' Please upgrade your plan or contact support.'
              : ' Consider upgrading your plan to avoid interruptions.'}
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isCritical ? 'bg-red-600' : 'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

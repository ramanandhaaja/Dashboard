'use client';

import { BillingOverview } from '@/components/billing/billing-overview';
import { UsageTrendChart, type UsageDataPoint } from '@/components/billing/usage-trend-chart';
import {
  OperationBreakdownChart,
  type OperationData,
} from '@/components/billing/operation-breakdown-chart';
import { TopUsersTable, type TopUser } from '@/components/billing/top-users-table';
import { UsageQuotaBanner } from '@/components/billing/usage-quota-banner';
import { ExportReportButton } from '@/components/billing/export-report-button';
import { PurchaseTokensDialog } from '@/components/billing/purchase-tokens-dialog';

// Mock data
const mockTrendData: UsageDataPoint[] = [
  { date: '2025-01-01', inputTokens: 3000, outputTokens: 2000, total: 5000 },
  { date: '2025-01-02', inputTokens: 4500, outputTokens: 3200, total: 7700 },
  { date: '2025-01-03', inputTokens: 5200, outputTokens: 3800, total: 9000 },
  { date: '2025-01-04', inputTokens: 3800, outputTokens: 2500, total: 6300 },
  { date: '2025-01-05', inputTokens: 6000, outputTokens: 4200, total: 10200 },
  { date: '2025-01-06', inputTokens: 5500, outputTokens: 3900, total: 9400 },
  { date: '2025-01-07', inputTokens: 7000, outputTokens: 5000, total: 12000 },
];

const mockOperationData: OperationData[] = [
  { name: 'DE&I Analysis', value: 65000, color: '#3b82f6' },
  { name: 'Summarization', value: 20000, color: '#f59e0b' },
  { name: 'Other', value: 5000, color: '#ef4444' },
];

const mockTopUsers: TopUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@acme.com',
    totalTokens: 45000,
    operationsCount: 320,
    lastActivity: '2025-01-07',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@acme.com',
    totalTokens: 32000,
    operationsCount: 245,
    lastActivity: '2025-01-06',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@acme.com',
    totalTokens: 28000,
    operationsCount: 198,
    lastActivity: '2025-01-07',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@acme.com',
    totalTokens: 15000,
    operationsCount: 112,
    lastActivity: '2025-01-05',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@acme.com',
    totalTokens: 5000,
    operationsCount: 45,
    lastActivity: '2025-01-04',
  },
];

export default function BillingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing & Usage</h1>
            <p className="text-muted-foreground mt-1">Monitor token consumption and costs</p>
          </div>
          <div className="flex items-center gap-3">
            <PurchaseTokensDialog />
            <ExportReportButton />
          </div>
        </div>

        {/* Quota Warning Banner */}
        <UsageQuotaBanner currentUsage={125000} quota={150000} />

        {/* Billing Overview */}
        <BillingOverview
          currentPeriod="January 1 - January 31, 2025"
          totalTokens={125000}
          estimatedCost={45.5}
          quota={150000}
          daysRemaining={24}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsageTrendChart data={mockTrendData} />
          <OperationBreakdownChart data={mockOperationData} />
        </div>

        {/* Top Users Table */}
        <TopUsersTable users={mockTopUsers} />
      </div>
    </div>
  );
}

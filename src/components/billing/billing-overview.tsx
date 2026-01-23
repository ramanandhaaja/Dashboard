'use client';

import { CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';

interface BillingOverviewProps {
  currentPeriod: string;
  totalTokens: number;
  estimatedCost: number;
  quota?: number;
  daysRemaining: number;
}

export function BillingOverview({
  currentPeriod,
  totalTokens,
  estimatedCost,
  quota,
  daysRemaining,
}: BillingOverviewProps) {
  const quotaPercentage = quota ? (totalTokens / quota) * 100 : 0;

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Billing Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Current Period: {currentPeriod}</p>
        </div>
        <CreditCard className="w-8 h-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-accent to-primary/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-primary">Total Tokens</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTokens.toLocaleString()}</p>
          {quota && (
            <p className="text-xs text-muted-foreground mt-1">
              {quotaPercentage.toFixed(1)}% of quota
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-chart-3/10 to-chart-3/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-chart-3" />
            <p className="text-sm font-medium text-chart-3">Estimated Cost</p>
          </div>
          <p className="text-2xl font-bold text-foreground">${estimatedCost.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on OpenAI pricing</p>
        </div>

        <div className="bg-gradient-to-br from-accent to-primary/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-primary">Days Remaining</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{daysRemaining}</p>
          <p className="text-xs text-muted-foreground mt-1">In current billing period</p>
        </div>

        {quota && (
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-secondary" />
              <p className="text-sm font-medium text-secondary">Token Quota</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{quota.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(quota - totalTokens).toLocaleString()} remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

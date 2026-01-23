"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Settings as SettingsIcon,
  Building2,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data matching other pages
const mockBillingData = {
  currentPeriod: {
    totalTokens: 90000,
    estimatedCost: 5.40,
    daysRemaining: 18,
    quotaUsed: 45,
  },
  trend: [
    { date: "Nov 20", tokens: 2500 },
    { date: "Nov 21", tokens: 3200 },
    { date: "Nov 22", tokens: 2800 },
    { date: "Nov 23", tokens: 3500 },
    { date: "Nov 24", tokens: 4100 },
    { date: "Nov 25", tokens: 3800 },
    { date: "Nov 26", tokens: 4200 },
  ],
};

const mockCompanyData = {
  name: "Acme Corporation",
  planTier: "professional" as const,
  userCount: 5,
  activeUsers: 4,
  recentUsers: [
    { name: "John Doe", email: "john@acme.com", status: "active" },
    { name: "Jane Smith", email: "jane@acme.com", status: "active" },
    { name: "Charlie Brown", email: "charlie@acme.com", status: "invited" },
  ],
};

const mockSettings = {
  groupBy: "headings",
  reviewInterval: "per_sentence",
  autoCorrection: true,
  sensitivityLevel: "moderate",
  tonePreference: "formal",
};

export default function Dashboard() {
  const { data: session } = useSession();

  const planColors = {
    starter: "bg-accent text-accent-foreground",
    professional: "bg-accent text-primary",
    enterprise: "bg-secondary/10 text-secondary",
  };

  const tokenTrend = mockBillingData.trend[mockBillingData.trend.length - 1].tokens -
                     mockBillingData.trend[mockBillingData.trend.length - 2].tokens;
  const trendPercentage = ((tokenTrend / mockBillingData.trend[mockBillingData.trend.length - 2].tokens) * 100).toFixed(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session?.user?.name || 'User'}!
          </p>
        </div>

        {/* Billing Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Billing Overview
            </h2>
            <Link href="/dashboard/billing">
              <Button variant="ghost" size="sm" className="gap-1">
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total Tokens</p>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                {mockBillingData.currentPeriod.totalTokens.toLocaleString()}
              </p>
              <p className={`text-sm mt-1 ${tokenTrend > 0 ? 'text-chart-3' : 'text-destructive'}`}>
                {tokenTrend > 0 ? '+' : ''}{trendPercentage}% from yesterday
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                <DollarSign className="w-5 h-5 text-chart-3" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                ${mockBillingData.currentPeriod.estimatedCost.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">This billing cycle</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                {mockBillingData.currentPeriod.daysRemaining}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Until next billing</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Quota Used</p>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                {mockBillingData.currentPeriod.quotaUsed}%
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-secondary h-2 rounded-full transition-all"
                  style={{ width: `${mockBillingData.currentPeriod.quotaUsed}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Company Overview
            </h2>
            <Link href="/dashboard/company">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage Company
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Company Stats */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{mockCompanyData.name}</h3>
                  <Badge className={`mt-2 ${planColors[mockCompanyData.planTier]}`}>
                    {mockCompanyData.planTier.charAt(0).toUpperCase() + mockCompanyData.planTier.slice(1)} Plan
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{mockCompanyData.userCount}</p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{mockCompanyData.activeUsers}</p>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Team Members</h3>
              <div className="space-y-3">
                {mockCompanyData.recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={user.status === 'active' ? 'text-chart-3 border-chart-3/20' : 'text-secondary border-secondary/20'}
                    >
                      {user.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Add-in Settings
            </h2>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="gap-1">
                Configure
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Document Grouping</p>
                <p className="text-base font-semibold text-foreground capitalize">
                  {mockSettings.groupBy === 'line_break' ? 'Line Break' : mockSettings.groupBy}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Review Interval</p>
                <p className="text-base font-semibold text-foreground capitalize">
                  {mockSettings.reviewInterval.replace('_', ' ')}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Auto-Correction</p>
                <div className="flex items-center gap-2">
                  <Badge variant={mockSettings.autoCorrection ? "default" : "outline"} className={mockSettings.autoCorrection ? "bg-primary text-primary-foreground" : ""}>
                    {mockSettings.autoCorrection ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Enabled
                      </>
                    ) : (
                      'Disabled'
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Sensitivity Level</p>
                <p className="text-base font-semibold text-foreground capitalize">
                  {mockSettings.sensitivityLevel}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tone Preference</p>
                <p className="text-base font-semibold text-foreground capitalize">
                  {mockSettings.tonePreference}
                </p>
              </div>

              <div className="flex items-center">
                <div className="bg-chart-3/10 border border-chart-3/20 rounded-lg px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-chart-3" />
                  <span className="text-sm font-medium text-chart-3">Configuration Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-accent to-secondary/10 rounded-lg border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/company">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 hover:bg-primary/10 hover:text-primary hover:border-primary">
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Invite Team Members</p>
                  <p className="text-xs text-muted-foreground">Add users to your organization</p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/billing">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 hover:bg-primary/10 hover:text-primary hover:border-primary">
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">View Usage Details</p>
                  <p className="text-xs text-muted-foreground">Track token consumption</p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 hover:bg-primary/10 hover:text-primary hover:border-primary">
                <SettingsIcon className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Update Settings</p>
                  <p className="text-xs text-muted-foreground">Configure add-in preferences</p>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

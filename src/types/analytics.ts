/** Metric value with trend comparison */
export interface MetricValue {
  value: number;
  trend: number;
  previousValue: number;
}

/** Hero metrics: 4 top-level KPI cards */
export interface HeroMetricsData {
  healthScore: MetricValue;
  csrdReadiness: MetricValue;
  costSavings: MetricValue;
  riskReduction: MetricValue;
}

/** Category breakdown within a module */
export interface CategoryData {
  name: string;
  count: number;
  percentage: number;
}

/** Single module data (Bias, Tone, or Clarity) */
export interface ModuleData {
  score: number;
  activeUserPercentage: number;
  trend: number;
  incidentCount: number;
  resolvedCount: number;
  categories: CategoryData[];
  appBreakdown: Record<string, number>;
}

/** Three module tiles */
export interface ModulePerformanceData {
  bias: ModuleData;
  tone: ModuleData;
  clarity: ModuleData;
}

/** Department leaderboard entry */
export interface DepartmentLeaderboardEntry {
  name: string;
  healthScore: number;
  activeUsers: number;
  totalUsers: number;
  adoptionRate: number;
  trend: number;
  rank: number;
}

/** Monthly trend data point */
export interface TrendDataPoint {
  period: string;
  biasScore: number;
  toneScore: number;
  clarityScore: number;
  overallScore: number;
}

/** Quarterly target */
export interface QuarterlyTarget {
  name: string;
  current: number;
  target: number;
  unit: string;
}

/** Trend analysis data */
export interface TrendData {
  monthly: TrendDataPoint[];
  quarterlyTargets: QuarterlyTarget[];
}

/** App breakdown per-app data */
export interface AppBreakdownEntry {
  biasCount: number;
  toneCount: number;
  clarityCount: number;
  totalCount: number;
}

/** Cross-app breakdown */
export interface AppBreakdownData {
  word: AppBreakdownEntry;
  outlook: AppBreakdownEntry;
  teams: AppBreakdownEntry;
}

/** Top-level dashboard analytics response */
export interface DashboardAnalyticsData {
  heroMetrics: HeroMetricsData;
  modules: ModulePerformanceData;
  departments: DepartmentLeaderboardEntry[];
  trends: TrendData;
  appBreakdown: AppBreakdownData;
}

/** Filters for dashboard queries */
export interface DashboardFilters {
  companyId?: string;
  userId?: string;
}

export type DashboardScope = 'guest' | 'bot' | 'company';

import type { DashboardAnalyticsData } from '@/types/analytics';

/**
 * Dummy data for Phase 1 KPI dashboard development.
 * Replace with real API data when endpoints are ready.
 */
export const dummyAnalyticsData: DashboardAnalyticsData = {
  heroMetrics: {
    healthScore: { value: 82, trend: 5.2, previousValue: 77 },
    csrdReadiness: { value: 71, trend: 3.8, previousValue: 67 },
    costSavings: { value: 12450, trend: 18.5, previousValue: 10500 },
    riskReduction: { value: 34, trend: 8.1, previousValue: 26 },
  },
  modules: {
    bias: {
      score: 78,
      activeUserPercentage: 83,
      trend: 4.2,
      incidentCount: 41,
      resolvedCount: 35,
      categories: [
        { name: 'Gender-neutral language', count: 18, percentage: 44 },
        { name: 'Cultural sensitivity', count: 12, percentage: 29 },
        { name: 'Age-inclusive language', count: 7, percentage: 17 },
        { name: 'Disability-inclusive', count: 4, percentage: 10 },
      ],
      appBreakdown: { word: 32, outlook: 6, teams: 3 },
    },
    tone: {
      score: 85,
      activeUserPercentage: 67,
      trend: 2.1,
      incidentCount: 14,
      resolvedCount: 12,
      categories: [
        { name: 'Overly formal', count: 5, percentage: 36 },
        { name: 'Casual/unprofessional', count: 4, percentage: 29 },
        { name: 'Aggressive tone', count: 3, percentage: 21 },
        { name: 'Passive-aggressive', count: 2, percentage: 14 },
      ],
      appBreakdown: { word: 8, outlook: 4, teams: 2 },
    },
    clarity: {
      score: 72,
      activeUserPercentage: 55,
      trend: -1.3,
      incidentCount: 6,
      resolvedCount: 4,
      categories: [
        { name: 'Jargon usage', count: 3, percentage: 50 },
        { name: 'Complex sentences', count: 2, percentage: 33 },
        { name: 'Ambiguous phrasing', count: 1, percentage: 17 },
      ],
      appBreakdown: { word: 4, outlook: 1, teams: 1 },
    },
  },
  departments: [
    { name: 'Marketing', healthScore: 91, activeUsers: 8, totalUsers: 10, adoptionRate: 80, trend: 3.5, rank: 1 },
    { name: 'Engineering', healthScore: 84, activeUsers: 12, totalUsers: 18, adoptionRate: 67, trend: 5.2, rank: 2 },
    { name: 'Sales', healthScore: 79, activeUsers: 6, totalUsers: 8, adoptionRate: 75, trend: -1.1, rank: 3 },
    { name: 'HR', healthScore: 76, activeUsers: 3, totalUsers: 5, adoptionRate: 60, trend: 2.0, rank: 4 },
    { name: 'Legal', healthScore: 65, activeUsers: 2, totalUsers: 4, adoptionRate: 50, trend: -3.2, rank: 5 },
  ],
  trends: {
    monthly: [
      { period: '2025-09', biasScore: 65, toneScore: 72, clarityScore: 60, overallScore: 66 },
      { period: '2025-10', biasScore: 68, toneScore: 75, clarityScore: 63, overallScore: 69 },
      { period: '2025-11', biasScore: 72, toneScore: 78, clarityScore: 65, overallScore: 72 },
      { period: '2025-12', biasScore: 74, toneScore: 80, clarityScore: 68, overallScore: 74 },
      { period: '2026-01', biasScore: 76, toneScore: 83, clarityScore: 70, overallScore: 76 },
      { period: '2026-02', biasScore: 78, toneScore: 85, clarityScore: 72, overallScore: 78 },
    ],
    quarterlyTargets: [
      { name: 'Health Score', current: 82, target: 85, unit: 'points' },
      { name: 'Adoption Rate', current: 67, target: 90, unit: '%' },
      { name: 'Issue Resolution', current: 83, target: 80, unit: '%' },
    ],
  },
  appBreakdown: {
    word: { biasCount: 32, toneCount: 8, clarityCount: 4, totalCount: 44 },
    outlook: { biasCount: 6, toneCount: 4, clarityCount: 1, totalCount: 11 },
    teams: { biasCount: 3, toneCount: 2, clarityCount: 1, totalCount: 6 },
  },
};

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type {
  DashboardAnalyticsData,
  HeroMetricsData,
  ModulePerformanceData,
  ModuleData,
  DepartmentLeaderboardEntry,
  TrendData,
  AppBreakdownData,
} from '@/types/analytics';

type ModuleType = 'bias' | 'tone' | 'clarity';
type SourceApp = 'word' | 'outlook' | 'teams';

interface IssueRow {
  id: string;
  user_id: string;
  module_type: ModuleType | null;
  source_app: SourceApp | null;
  user_action: string | null;
  issue_type: string;
  detected_at: string;
}

interface UserRow {
  id: string;
  department: string | null;
}

interface TeamsRow {
  id: string;
  category: string | null;
  team_id: string;
  team_name: string | null;
  confidence_score: number | null;
  suggested_alternative: string | null;
  timestamp: string;
}

// Map dei_words_teams categories to bias/tone/clarity modules
const CATEGORY_TO_MODULE: Record<string, ModuleType> = {
  gendered: 'bias',
  racial: 'bias',
  ageist: 'bias',
  ableist: 'bias',
  cultural: 'bias',
  religious: 'bias',
  sexist: 'bias',
  homophobic: 'bias',
  aggressive: 'tone',
  dismissive: 'tone',
  condescending: 'tone',
  exclusionary: 'tone',
  insensitive: 'tone',
  jargon: 'clarity',
  ambiguous: 'clarity',
  vague: 'clarity',
};

function categoryToModule(category: string | null): ModuleType {
  if (!category) return 'bias';
  return CATEGORY_TO_MODULE[category.toLowerCase()] || 'bias';
}

/**
 * GET /api/analytics/dashboard
 *
 * Returns Phase 1 KPI data (DashboardAnalyticsData) computed from dei_issues
 * and dei_words_teams tables.
 *
 * Query params:
 *   scope: 'guest' | 'bot' | 'company'
 *   company_id: string (for company scope)
 *   user_id: string (for super_admin filtering)
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId, role, company_id } = session.user;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'guest';
    const filterCompanyId = searchParams.get('company_id');
    const filterUserId = searchParams.get('user_id');

    // ── Fetch dei_issues ──
    let issueQuery = supabase
      .from('dei_issues')
      .select('id, user_id, module_type, source_app, user_action, issue_type, detected_at');

    // Scope filtering
    if (scope === 'company' && filterCompanyId) {
      // Get all user IDs belonging to this company (covers issues with NULL company_id)
      const { data: companyMembers } = await supabase
        .from('company_members')
        .select('user_id')
        .eq('company_id', filterCompanyId)
        .eq('status', 'active');
      const memberUserIds = (companyMembers || []).map((m: { user_id: string }) => m.user_id);

      if (memberUserIds.length > 0) {
        // Match issues by company_id OR by user membership
        issueQuery = issueQuery.or(
          `company_id.eq.${filterCompanyId},user_id.in.(${memberUserIds.join(',')})`
        );
      } else {
        issueQuery = issueQuery.eq('company_id', filterCompanyId);
      }
    } else if (scope === 'guest') {
      // Guest = Word + Outlook issues
      issueQuery = issueQuery.in('source_app', ['word', 'outlook']);
      if (role === 'super_admin' && filterUserId) {
        issueQuery = issueQuery.eq('user_id', filterUserId);
      } else if (role !== 'super_admin' && company_id) {
        // Get all member user IDs to also catch issues with NULL company_id
        const { data: guestMembers } = await supabase
          .from('company_members')
          .select('user_id')
          .eq('company_id', company_id)
          .eq('status', 'active');
        const guestMemberIds = (guestMembers || []).map((m: { user_id: string }) => m.user_id);
        if (guestMemberIds.length > 0) {
          issueQuery = issueQuery.or(
            `company_id.eq.${company_id},user_id.in.(${guestMemberIds.join(',')})`
          );
        } else {
          issueQuery = issueQuery.eq('company_id', company_id);
        }
      } else if (role !== 'super_admin') {
        issueQuery = issueQuery.eq('user_id', userId);
      }
    } else if (scope === 'bot') {
      // Bot = Teams issues only
      issueQuery = issueQuery.eq('source_app', 'teams');
      if (role !== 'super_admin' && company_id) {
        const { data: botMembers } = await supabase
          .from('company_members')
          .select('user_id')
          .eq('company_id', company_id)
          .eq('status', 'active');
        const botMemberIds = (botMembers || []).map((m: { user_id: string }) => m.user_id);
        if (botMemberIds.length > 0) {
          issueQuery = issueQuery.or(
            `company_id.eq.${company_id},user_id.in.(${botMemberIds.join(',')})`
          );
        } else {
          issueQuery = issueQuery.eq('company_id', company_id);
        }
      }
    } else if (scope === 'company') {
      // Company without filter: use session company_id
      if (role !== 'super_admin' && company_id) {
        const { data: compMembers } = await supabase
          .from('company_members')
          .select('user_id')
          .eq('company_id', company_id)
          .eq('status', 'active');
        const compMemberIds = (compMembers || []).map((m: { user_id: string }) => m.user_id);
        if (compMemberIds.length > 0) {
          issueQuery = issueQuery.or(
            `company_id.eq.${company_id},user_id.in.(${compMemberIds.join(',')})`
          );
        } else {
          issueQuery = issueQuery.eq('company_id', company_id);
        }
      }
    }

    const { data: issues, error: issueError } = await issueQuery;
    if (issueError) {
      console.error('Error fetching dei_issues for dashboard KPI:', issueError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    const rows = (issues || []) as IssueRow[];

    // ── Fetch Teams detections for bot scope or company cross-app ──
    let teamsRows: TeamsRow[] = [];
    if (scope === 'bot' || scope === 'company') {
      let teamsQuery = supabase
        .from('dei_words_teams')
        .select('id, category, team_id, team_name, confidence_score, suggested_alternative, timestamp');

      // Filter by user's sender_name when super_admin selects a user (bot scope)
      if (scope === 'bot' && role === 'super_admin' && filterUserId) {
        const { data: filterUser } = await supabase
          .from('users')
          .select('name')
          .eq('id', filterUserId)
          .single();
        if (filterUser?.name) {
          teamsQuery = teamsQuery.ilike('sender_name', filterUser.name);
        }
      } else if (scope === 'bot' && role !== 'super_admin' && company_id) {
        // Company users on bot page: only show data from their company members
        const { data: botMembers } = await supabase
          .from('company_members')
          .select('user_id')
          .eq('company_id', company_id)
          .eq('status', 'active');

        if (botMembers && botMembers.length > 0) {
          const memberIds = botMembers.map((m: { user_id: string }) => m.user_id);
          const { data: memberUsers } = await supabase
            .from('users')
            .select('email')
            .in('id', memberIds);

          const memberEmails = (memberUsers || []).map((u: { email: string }) => u.email.toLowerCase());
          if (memberEmails.length > 0) {
            teamsQuery = teamsQuery.in('sender_email', memberEmails);
          } else {
            teamsRows = [];
          }
        }
      } else if (scope === 'company') {
        // Company analytics page: filter teams data by the selected (or session) company
        const targetCompanyId = filterCompanyId || company_id;
        if (targetCompanyId) {
          const { data: compMembers } = await supabase
            .from('company_members')
            .select('user_id')
            .eq('company_id', targetCompanyId)
            .eq('status', 'active');

          if (compMembers && compMembers.length > 0) {
            const memberIds = compMembers.map((m: { user_id: string }) => m.user_id);
            const { data: memberUsers } = await supabase
              .from('users')
              .select('email')
              .in('id', memberIds);

            const memberEmails = (memberUsers || []).map((u: { email: string }) => u.email.toLowerCase());
            if (memberEmails.length > 0) {
              teamsQuery = teamsQuery.in('sender_email', memberEmails);
            } else {
              teamsRows = [];
            }
          } else {
            teamsRows = [];
          }
        }
        // super_admin with no company filter: show all teams data
      }

      const { data: teamsData } = await teamsQuery;
      teamsRows = (teamsData || []) as TeamsRow[];
    }

    // ── Fetch users with department for department ranking ──
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    let userDepts: UserRow[] = [];
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, department')
        .in('id', userIds);
      userDepts = (usersData || []) as UserRow[];
    }
    const userDeptMap = new Map(userDepts.map((u) => [u.id, u.department || 'Unassigned']));

    // ── Compute Hero Metrics ──
    const heroMetrics = scope === 'bot'
      ? computeBotHeroMetrics(teamsRows)
      : computeHeroMetrics(rows);

    // ── Compute Module Performance ──
    const modules = scope === 'bot'
      ? computeBotModulePerformance(teamsRows)
      : scope === 'company'
        ? computeCompanyModulePerformance(rows, teamsRows)
        : computeModulePerformance(rows);

    // ── Compute Department Leaderboard ──
    const departments = computeDepartmentLeaderboard(rows, userDeptMap);

    // ── Compute Trends ──
    const trends = scope === 'bot'
      ? computeBotTrends(teamsRows)
      : computeTrends(rows);

    // ── Compute App Breakdown (company scope uses cross-app data) ──
    const appBreakdown = computeAppBreakdown(rows, teamsRows);

    const result: DashboardAnalyticsData = {
      heroMetrics,
      modules,
      departments,
      trends,
      appBreakdown,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Unexpected error in dashboard analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function computeHeroMetrics(rows: IssueRow[]): HeroMetricsData {
  const total = rows.length;
  const resolved = rows.filter(
    (r) => r.user_action === 'accepted' || r.user_action === 'auto_corrected'
  ).length;

  // Health Score = resolution rate as percentage
  const healthScore = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // CSRD Readiness = proportion of issues that have module_type assigned (data quality indicator)
  const classified = rows.filter((r) => r.module_type !== null).length;
  const csrdReadiness = total > 0 ? Math.round((classified / total) * 100) : 0;

  // Cost savings estimate: each resolved issue saves ~€2.50 in manual review time
  const costSavings = resolved * 2.5;

  // Risk reduction: unresolved issues as inverse percentage
  const riskReduction = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Simulate previous period (would need date range filtering for real implementation)
  const prevFactor = 0.9;

  return {
    healthScore: {
      value: healthScore,
      trend: healthScore - Math.round(healthScore * prevFactor),
      previousValue: Math.round(healthScore * prevFactor),
    },
    csrdReadiness: {
      value: csrdReadiness,
      trend: csrdReadiness - Math.round(csrdReadiness * prevFactor),
      previousValue: Math.round(csrdReadiness * prevFactor),
    },
    costSavings: {
      value: costSavings,
      trend: costSavings - costSavings * prevFactor,
      previousValue: costSavings * prevFactor,
    },
    riskReduction: {
      value: riskReduction,
      trend: riskReduction - Math.round(riskReduction * prevFactor),
      previousValue: Math.round(riskReduction * prevFactor),
    },
  };
}

function computeModulePerformance(rows: IssueRow[]): ModulePerformanceData {
  const totalUsers = new Set(rows.map((r) => r.user_id)).size;

  function buildModule(mod: ModuleType): ModuleData {
    const modRows = rows.filter((r) => r.module_type === mod);
    const resolved = modRows.filter(
      (r) => r.user_action === 'accepted' || r.user_action === 'auto_corrected'
    ).length;
    const activeUsers = new Set(modRows.map((r) => r.user_id)).size;

    // Group by issue_type for categories
    const catMap = new Map<string, number>();
    modRows.forEach((r) => {
      const cat = r.issue_type || 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    const categories = Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: modRows.length > 0 ? Math.round((count / modRows.length) * 100) : 0,
    }));

    // App breakdown for this module
    const appMap: Record<string, number> = { word: 0, outlook: 0 };
    modRows.forEach((r) => {
      if (r.source_app) appMap[r.source_app] = (appMap[r.source_app] || 0) + 1;
    });

    const score = modRows.length > 0 ? Math.round((resolved / modRows.length) * 100) : 100;

    return {
      score,
      activeUserPercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      trend: 3,
      incidentCount: modRows.length,
      resolvedCount: resolved,
      categories,
      appBreakdown: appMap,
    };
  }

  return {
    bias: buildModule('bias'),
    tone: buildModule('tone'),
    clarity: buildModule('clarity'),
  };
}

function computeCompanyModulePerformance(rows: IssueRow[], teamsRows: TeamsRow[]): ModulePerformanceData {
  const totalUsers = new Set(rows.map((r) => r.user_id)).size;

  function buildCompanyModule(mod: ModuleType): ModuleData {
    // Word + Outlook data from dei_issues
    const modRows = rows.filter((r) => r.module_type === mod);
    const resolved = modRows.filter(
      (r) => r.user_action === 'accepted' || r.user_action === 'auto_corrected'
    ).length;
    const activeUsers = new Set(modRows.map((r) => r.user_id)).size;

    // Teams data from dei_words_teams
    const teamsModRows = teamsRows.filter((r) => categoryToModule(r.category) === mod);
    const teamsResolved = teamsModRows.filter((r) => r.suggested_alternative).length;

    // Merge categories from both sources
    const catMap = new Map<string, number>();
    modRows.forEach((r) => {
      const cat = r.issue_type || 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    teamsModRows.forEach((r) => {
      const cat = r.category || 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    const categories = Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: (modRows.length + teamsModRows.length) > 0
        ? Math.round((count / (modRows.length + teamsModRows.length)) * 100)
        : 0,
    }));

    // App breakdown: Word + Outlook + Teams
    const appMap: Record<string, number> = { word: 0, outlook: 0, teams: teamsModRows.length };
    modRows.forEach((r) => {
      if (r.source_app) appMap[r.source_app] = (appMap[r.source_app] || 0) + 1;
    });

    const totalIncidents = modRows.length + teamsModRows.length;
    const totalResolved = resolved + teamsResolved;
    const score = totalIncidents > 0 ? Math.round((totalResolved / totalIncidents) * 100) : 100;

    return {
      score,
      activeUserPercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      trend: 3,
      incidentCount: totalIncidents,
      resolvedCount: totalResolved,
      categories,
      appBreakdown: appMap,
    };
  }

  return {
    bias: buildCompanyModule('bias'),
    tone: buildCompanyModule('tone'),
    clarity: buildCompanyModule('clarity'),
  };
}

function computeDepartmentLeaderboard(
  rows: IssueRow[],
  userDeptMap: Map<string, string>
): DepartmentLeaderboardEntry[] {
  // Group by department
  const deptStats = new Map<
    string,
    { totalIssues: number; resolved: number; users: Set<string> }
  >();

  rows.forEach((r) => {
    const dept = userDeptMap.get(r.user_id) || 'Unassigned';
    if (!deptStats.has(dept)) {
      deptStats.set(dept, { totalIssues: 0, resolved: 0, users: new Set() });
    }
    const s = deptStats.get(dept)!;
    s.totalIssues++;
    s.users.add(r.user_id);
    if (r.user_action === 'accepted' || r.user_action === 'auto_corrected') {
      s.resolved++;
    }
  });

  const entries = Array.from(deptStats.entries())
    .map(([name, s]) => {
      const healthScore = s.totalIssues > 0 ? Math.round((s.resolved / s.totalIssues) * 100) : 0;
      return {
        name,
        healthScore,
        activeUsers: s.users.size,
        totalUsers: s.users.size, // Would need full department roster for accurate count
        adoptionRate: 100, // placeholder — needs total company headcount per dept
        trend: 2,
        rank: 0, // computed below
      };
    })
    .sort((a, b) => b.healthScore - a.healthScore);

  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

function computeTrends(rows: IssueRow[]): TrendData {
  // Group by month
  const monthMap = new Map<
    string,
    { bias: { total: number; resolved: number }; tone: { total: number; resolved: number }; clarity: { total: number; resolved: number }; overall: { total: number; resolved: number } }
  >();

  rows.forEach((r) => {
    const month = r.detected_at ? r.detected_at.substring(0, 7) : 'Unknown'; // YYYY-MM
    if (!monthMap.has(month)) {
      monthMap.set(month, {
        bias: { total: 0, resolved: 0 },
        tone: { total: 0, resolved: 0 },
        clarity: { total: 0, resolved: 0 },
        overall: { total: 0, resolved: 0 },
      });
    }
    const m = monthMap.get(month)!;
    const isResolved = r.user_action === 'accepted' || r.user_action === 'auto_corrected';

    m.overall.total++;
    if (isResolved) m.overall.resolved++;

    if (r.module_type === 'bias') {
      m.bias.total++;
      if (isResolved) m.bias.resolved++;
    } else if (r.module_type === 'tone') {
      m.tone.total++;
      if (isResolved) m.tone.resolved++;
    } else if (r.module_type === 'clarity') {
      m.clarity.total++;
      if (isResolved) m.clarity.resolved++;
    }
  });

  const scoreOf = (s: { total: number; resolved: number }) =>
    s.total > 0 ? Math.round((s.resolved / s.total) * 100) : 0;

  const monthly = Array.from(monthMap.entries())
    .map(([period, m]) => ({
      period,
      biasScore: scoreOf(m.bias),
      toneScore: scoreOf(m.tone),
      clarityScore: scoreOf(m.clarity),
      overallScore: scoreOf(m.overall),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  // Quarterly targets (static for now)
  const quarterlyTargets = [
    { name: 'Communication Health Score', current: monthly.at(-1)?.overallScore ?? 0, target: 90, unit: '%' },
    { name: 'CSRD Compliance', current: monthly.at(-1)?.overallScore ?? 0, target: 85, unit: '%' },
    { name: 'Cost Savings Target', current: rows.length * 2.5, target: 5000, unit: '€' },
  ];

  return { monthly, quarterlyTargets };
}

function computeAppBreakdown(rows: IssueRow[], teamsRows: TeamsRow[]): AppBreakdownData {
  const apps: Record<SourceApp, { bias: number; tone: number; clarity: number; total: number }> = {
    word: { bias: 0, tone: 0, clarity: 0, total: 0 },
    outlook: { bias: 0, tone: 0, clarity: 0, total: 0 },
    teams: { bias: 0, tone: 0, clarity: 0, total: 0 },
  };

  // From dei_issues
  rows.forEach((r) => {
    const app = r.source_app || 'word';
    if (apps[app]) {
      apps[app].total++;
      if (r.module_type === 'bias') apps[app].bias++;
      else if (r.module_type === 'tone') apps[app].tone++;
      else if (r.module_type === 'clarity') apps[app].clarity++;
    }
  });

  // From dei_words_teams — map category to module
  teamsRows.forEach((r) => {
    apps.teams.total++;
    const mod = categoryToModule(r.category);
    apps.teams[mod]++;
  });

  return {
    word: { biasCount: apps.word.bias, toneCount: apps.word.tone, clarityCount: apps.word.clarity, totalCount: apps.word.total },
    outlook: { biasCount: apps.outlook.bias, toneCount: apps.outlook.tone, clarityCount: apps.outlook.clarity, totalCount: apps.outlook.total },
    teams: { biasCount: apps.teams.bias, toneCount: apps.teams.tone, clarityCount: apps.teams.clarity, totalCount: apps.teams.total },
  };
}

// ─── Bot-specific compute functions (dei_words_teams) ────────────────────────

function computeBotHeroMetrics(teamsRows: TeamsRow[]): HeroMetricsData {
  const total = teamsRows.length;

  // Health Score = average confidence score across all detections
  const avgConfidence = total > 0
    ? Math.round(teamsRows.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / total * 100)
    : 0;

  // CSRD Readiness = proportion of detections with a suggested alternative
  const withAlternative = teamsRows.filter((r) => r.suggested_alternative).length;
  const csrdReadiness = total > 0 ? Math.round((withAlternative / total) * 100) : 0;

  // Cost savings: each detection saves ~€2.50 in manual review
  const costSavings = total * 2.5;

  // Risk reduction = detections with high confidence (>0.7)
  const highConfidence = teamsRows.filter((r) => (r.confidence_score || 0) > 0.7).length;
  const riskReduction = total > 0 ? Math.round((highConfidence / total) * 100) : 0;

  const prevFactor = 0.9;

  return {
    healthScore: {
      value: avgConfidence,
      trend: avgConfidence - Math.round(avgConfidence * prevFactor),
      previousValue: Math.round(avgConfidence * prevFactor),
    },
    csrdReadiness: {
      value: csrdReadiness,
      trend: csrdReadiness - Math.round(csrdReadiness * prevFactor),
      previousValue: Math.round(csrdReadiness * prevFactor),
    },
    costSavings: {
      value: costSavings,
      trend: costSavings - costSavings * prevFactor,
      previousValue: costSavings * prevFactor,
    },
    riskReduction: {
      value: riskReduction,
      trend: riskReduction - Math.round(riskReduction * prevFactor),
      previousValue: Math.round(riskReduction * prevFactor),
    },
  };
}

function computeBotModulePerformance(teamsRows: TeamsRow[]): ModulePerformanceData {
  const totalTeams = new Set(teamsRows.map((r) => r.team_id)).size;

  function buildBotModule(mod: ModuleType): ModuleData {
    const modRows = teamsRows.filter((r) => categoryToModule(r.category) === mod);
    const withAlternative = modRows.filter((r) => r.suggested_alternative).length;
    const activeTeams = new Set(modRows.map((r) => r.team_id)).size;

    // Group by category for breakdown
    const catMap = new Map<string, number>();
    modRows.forEach((r) => {
      const cat = r.category || 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    const categories = Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: modRows.length > 0 ? Math.round((count / modRows.length) * 100) : 0,
    }));

    // Average confidence for this module
    const avgConf = modRows.length > 0
      ? Math.round(modRows.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / modRows.length * 100)
      : 100;

    return {
      score: avgConf,
      activeUserPercentage: totalTeams > 0 ? Math.round((activeTeams / totalTeams) * 100) : 0,
      trend: 3,
      incidentCount: modRows.length,
      resolvedCount: withAlternative,
      categories,
      appBreakdown: { teams: modRows.length },
    };
  }

  return {
    bias: buildBotModule('bias'),
    tone: buildBotModule('tone'),
    clarity: buildBotModule('clarity'),
  };
}

function computeBotTrends(teamsRows: TeamsRow[]): TrendData {
  const monthMap = new Map<
    string,
    { bias: { total: number; resolved: number }; tone: { total: number; resolved: number }; clarity: { total: number; resolved: number }; overall: { total: number; resolved: number } }
  >();

  teamsRows.forEach((r) => {
    const month = r.timestamp ? r.timestamp.substring(0, 7) : 'Unknown';
    if (!monthMap.has(month)) {
      monthMap.set(month, {
        bias: { total: 0, resolved: 0 },
        tone: { total: 0, resolved: 0 },
        clarity: { total: 0, resolved: 0 },
        overall: { total: 0, resolved: 0 },
      });
    }
    const m = monthMap.get(month)!;
    const mod = categoryToModule(r.category);
    const hasAlt = !!r.suggested_alternative;

    m.overall.total++;
    if (hasAlt) m.overall.resolved++;

    m[mod].total++;
    if (hasAlt) m[mod].resolved++;
  });

  const scoreOf = (s: { total: number; resolved: number }) =>
    s.total > 0 ? Math.round((s.resolved / s.total) * 100) : 0;

  const monthly = Array.from(monthMap.entries())
    .map(([period, m]) => ({
      period,
      biasScore: scoreOf(m.bias),
      toneScore: scoreOf(m.tone),
      clarityScore: scoreOf(m.clarity),
      overallScore: scoreOf(m.overall),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const quarterlyTargets = [
    { name: 'Communication Health Score', current: monthly.at(-1)?.overallScore ?? 0, target: 90, unit: '%' },
    { name: 'CSRD Compliance', current: monthly.at(-1)?.overallScore ?? 0, target: 85, unit: '%' },
    { name: 'Cost Savings Target', current: teamsRows.length * 2.5, target: 5000, unit: '€' },
  ];

  return { monthly, quarterlyTargets };
}

/** Maps to `companies` table */
export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  plan: string;
  status: string;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** Maps to `company_members` joined with user data */
export interface CompanyMember {
  user_id: string;
  company_role: CompanyRole;
  status: string;
  joined_at: string | null;
  user_name: string;
  user_email: string;
  department: string | null;
}

export type CompanyRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

/** Maps to `company_analytics` VIEW */
export interface CompanyAnalytics {
  active_users: number;
  total_issues_detected: number;
  issues_solved: number;
  issues_pending: number;
  total_tokens_used: number;
  total_cost_usd: number;
  overall_compliance_score_percentage: number;
}

/** Company list item: company + aggregated stats */
export interface CompanyListItem {
  company: CompanyData;
  member_count: number;
  analytics: CompanyAnalytics | null;
}

/** Company detail: company + members + analytics */
export interface CompanyDetail {
  company: CompanyData;
  members: CompanyMember[];
  analytics: CompanyAnalytics | null;
}

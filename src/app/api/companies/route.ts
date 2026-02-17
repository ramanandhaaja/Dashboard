import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, company_id } = session.user;

    // Individual users with no company
    if (role !== 'super_admin' && !company_id) {
      return NextResponse.json({ companies: [], noCompany: true });
    }

    if (role === 'super_admin') {
      // Super admin: fetch all companies with member counts + analytics
      const { data: companies, error: compErr } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (compErr) {
        console.error('Error fetching companies:', compErr);
        return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
      }

      // Fetch member counts per company
      const companyIds = companies?.map((c) => c.id) || [];

      const { data: memberCounts } = await supabase
        .from('company_members')
        .select('company_id')
        .in('company_id', companyIds)
        .eq('status', 'active');

      const countMap = new Map<string, number>();
      memberCounts?.forEach((m) => {
        countMap.set(m.company_id, (countMap.get(m.company_id) || 0) + 1);
      });

      // Fetch analytics for all companies
      const { data: analytics } = await supabase
        .from('company_analytics')
        .select('*')
        .in('company_id', companyIds);

      const analyticsMap = new Map(
        analytics?.map((a) => [a.company_id, a]) || []
      );

      const items = (companies || []).map((company) => {
        const a = analyticsMap.get(company.id);
        return {
          company,
          member_count: countMap.get(company.id) || 0,
          analytics: a
            ? {
                active_users: Number(a.active_users) || 0,
                total_issues_detected: Number(a.total_issues_detected) || 0,
                issues_solved: Number(a.issues_solved) || 0,
                issues_pending: Number(a.issues_pending) || 0,
                total_tokens_used: Number(a.total_tokens_used) || 0,
                total_cost_usd: Number(a.total_cost_usd) || 0,
                overall_compliance_score_percentage:
                  Number(a.overall_compliance_score_percentage) || 0,
              }
            : null,
        };
      });

      return NextResponse.json({ companies: items });
    }

    // Company user: fetch their single company as a detail view
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single();

    if (compErr || !company) {
      return NextResponse.json({ companies: [], noCompany: true });
    }

    // Fetch members
    const { data: membersRaw } = await supabase
      .from('company_members')
      .select('user_id, company_role, status, joined_at')
      .eq('company_id', company_id)
      .eq('status', 'active');

    const userIds = membersRaw?.map((m) => m.user_id) || [];
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, department')
      .in('id', userIds);

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    const members = (membersRaw || []).map((m) => {
      const user = userMap.get(m.user_id);
      return {
        user_id: m.user_id,
        company_role: m.company_role,
        status: m.status,
        joined_at: m.joined_at,
        user_name: user?.name || 'Unknown',
        user_email: user?.email || '',
        department: user?.department || null,
      };
    });

    // Fetch analytics
    const { data: analyticsRow } = await supabase
      .from('company_analytics')
      .select('*')
      .eq('company_id', company_id)
      .maybeSingle();

    const analytics = analyticsRow
      ? {
          active_users: Number(analyticsRow.active_users) || 0,
          total_issues_detected: Number(analyticsRow.total_issues_detected) || 0,
          issues_solved: Number(analyticsRow.issues_solved) || 0,
          issues_pending: Number(analyticsRow.issues_pending) || 0,
          total_tokens_used: Number(analyticsRow.total_tokens_used) || 0,
          total_cost_usd: Number(analyticsRow.total_cost_usd) || 0,
          overall_compliance_score_percentage:
            Number(analyticsRow.overall_compliance_score_percentage) || 0,
        }
      : null;

    return NextResponse.json({
      company: { company, members, analytics },
    });
  } catch (error) {
    console.error('Unexpected error in companies API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

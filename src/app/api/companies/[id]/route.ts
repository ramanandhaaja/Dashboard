import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: companyId } = await params;
    const { role, company_id } = session.user;

    // Authorization: super_admin can access any, others only their own company
    if (role !== 'super_admin' && company_id !== companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch company
    const { data: company, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (compErr || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Fetch members with user data
    const { data: membersRaw } = await supabase
      .from('company_members')
      .select('user_id, company_role, status, joined_at')
      .eq('company_id', companyId)
      .order('joined_at', { ascending: true });

    const userIds = membersRaw?.map((m) => m.user_id) || [];
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, department')
      .in('id', userIds.length > 0 ? userIds : ['__none__']);

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
      .eq('company_id', companyId)
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

    return NextResponse.json({ company, members, analytics });
  } catch (error) {
    console.error('Unexpected error in company detail API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

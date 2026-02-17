import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, company_id } = session.user;
    const { searchParams } = new URL(request.url);
    const filterCompanyId = searchParams.get('company_id');

    // Build scoped query
    let query = supabase
      .from('dei_issues')
      .select('detected_at, module_type, issue_type, user_action, auto_corrected, source_app, company_id')
      .order('detected_at', { ascending: false });

    if (role === 'super_admin' && filterCompanyId) {
      query = query.eq('company_id', filterCompanyId);
    } else if (role !== 'super_admin' && company_id) {
      query = query.eq('company_id', company_id);
    }

    const { data: issues, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Build CSV
    const headers = ['date', 'module_type', 'issue_category', 'issue_count', 'resolution_count', 'resolution_rate', 'department', 'source_app', 'health_score'];
    const rows: string[][] = [];

    // Group by date + module_type
    const grouped = new Map<string, { total: number; resolved: number; source: string; moduleType: string }>();
    issues?.forEach((issue) => {
      const date = issue.detected_at?.split('T')[0] || 'unknown';
      const mod = issue.module_type || 'unclassified';
      const key = `${date}|${mod}`;
      if (!grouped.has(key)) {
        grouped.set(key, { total: 0, resolved: 0, source: issue.source_app || 'unknown', moduleType: mod });
      }
      const g = grouped.get(key)!;
      g.total++;
      if (issue.user_action === 'accepted' || issue.auto_corrected) {
        g.resolved++;
      }
    });

    grouped.forEach((val, key) => {
      const [date] = key.split('|');
      const rate = val.total > 0 ? Math.round((val.resolved / val.total) * 100) : 0;
      rows.push([date, val.moduleType, val.moduleType, String(val.total), String(val.resolved), `${rate}%`, '-', val.source, '-']);
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="be-inc-csrd-data-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

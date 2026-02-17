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

    // Only super_admin can search users
    if (session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    // If no query, return all users (for dropdown list)
    if (query.length === 0) {
      const { data: allUsers, error: allError } = await supabase
        .from('users')
        .select('id, name, email, role, company_id, is_active')
        .order('name', { ascending: true })
        .limit(50);

      if (allError) {
        console.error('Error fetching users:', allError);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
      }

      return NextResponse.json({ users: allUsers || [] });
    }

    if (query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Search by name, email, or id
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, company_id, is_active')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,id.eq.${query}`)
      .order('name', { ascending: true })
      .limit(10);

    if (error) {
      // If the query isn't a valid UUID, the id.eq filter will fail — retry without it
      const { data: fallbackUsers, error: fallbackError } = await supabase
        .from('users')
        .select('id, name, email, role, company_id, is_active')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(10);

      if (fallbackError) {
        console.error('Error searching users:', fallbackError);
        return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
      }

      return NextResponse.json({ users: fallbackUsers || [] });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Unexpected error in user search API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

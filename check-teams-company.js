require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  // Total team issues
  const { count: total } = await supabase.from('dei_words_teams').select('*', { count: 'exact', head: true });
  console.log('Total dei_words_teams records:', total);

  // Get all records with sender_email
  const { data: allRecords } = await supabase.from('dei_words_teams').select('sender_email');

  // Count NULL sender_email
  const nullEmailCount = allRecords.filter(r => !r.sender_email).length;
  console.log('Records with NULL sender_email:', nullEmailCount);

  // Get unique emails
  const uniqueEmails = [...new Set(allRecords.map(r => r.sender_email?.toLowerCase()).filter(Boolean))];
  console.log('Unique sender emails:', uniqueEmails.length);
  uniqueEmails.forEach(e => console.log('  -', e));

  // Find which emails match users in the users table
  if (uniqueEmails.length > 0) {
    const { data: matchedUsers } = await supabase
      .from('users')
      .select('id, email, company_id')
      .in('email', uniqueEmails);

    console.log('\nMatched users in users table:', matchedUsers?.length || 0);
    matchedUsers?.forEach(u => console.log('  -', u.email, '| company_id:', u.company_id));

    // Emails NOT in users table
    const matchedEmailSet = new Set(matchedUsers?.map(u => u.email.toLowerCase()) || []);
    const unmatchedEmails = uniqueEmails.filter(e => !matchedEmailSet.has(e));
    console.log('\nEmails with NO user match:', unmatchedEmails.length);
    unmatchedEmails.forEach(e => console.log('  -', e));

    // Matched users with no company
    const noCompanyUsers = matchedUsers?.filter(u => !u.company_id) || [];
    console.log('\nMatched users with NO company_id:', noCompanyUsers.length);
    noCompanyUsers.forEach(u => console.log('  -', u.email));

    // Also check company_members table for those with company_id
    const usersWithCompany = matchedUsers?.filter(u => u.company_id) || [];
    for (const u of usersWithCompany) {
      const { data: membership } = await supabase
        .from('company_members')
        .select('company_id, status')
        .eq('user_id', u.id);
      console.log('\nMembership for', u.email, ':', JSON.stringify(membership));
    }

    // Count records that have no company association
    const noCompanyEmailSet = new Set([
      ...unmatchedEmails,
      ...noCompanyUsers.map(u => u.email.toLowerCase())
    ]);

    let noCompanyCount = 0;
    allRecords.forEach(r => {
      const email = r.sender_email?.toLowerCase();
      if (!email || noCompanyEmailSet.has(email)) {
        noCompanyCount++;
      }
    });

    console.log('\n=== SUMMARY ===');
    console.log('Total team issues:', total);
    console.log('Issues with NO company association:', noCompanyCount);
    console.log('Issues WITH company association:', total - noCompanyCount);
  }
}

check().catch(console.error);

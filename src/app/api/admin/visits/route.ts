import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizedUser } from '@/lib/auth';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function GET(req: NextRequest) {
  const user = await getAuthorizedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getAdminSupabase();

  try {
    // 1. Fetch total visits count
    const { count: totalVisits, error: countErr } = await supabase
      .from('web_visits')
      .select('*', { count: 'exact', head: true });

    if (countErr) throw countErr;

    // 2. Fetch visits grouped by page path
    const { data: pageStats, error: pageErr } = await supabase
      .from('web_visits')
      .select('page_path');

    if (pageErr) throw pageErr;

    const pageCounts: Record<string, number> = {};
    pageStats.forEach((v) => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });

    const formattedPageStats = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // 3. Fetch recent visits
    const { data: recentVisits, error: recentErr } = await supabase
      .from('web_visits')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (recentErr) throw recentErr;

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      pageStats: formattedPageStats,
      recentVisits
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

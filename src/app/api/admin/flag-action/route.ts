import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdminSession } from '@/lib/admin-auth'

export async function POST(req: Request) {
  if (!await checkAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { flag_id, listing_id, action } = await req.json()
  const supabase = await createServiceClient()

  await supabase.from('flags').update({ resolved: true, resolved_at: new Date().toISOString() }).eq('id', flag_id)

  if (action === 'resolve_remove') {
    await supabase.from('listings').update({ status: 'removed' }).eq('id', listing_id)
  }

  return NextResponse.json({ ok: true })
}

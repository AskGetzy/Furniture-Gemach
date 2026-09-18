import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdminSession } from '@/lib/admin-auth'

export async function POST(req: Request) {
  if (!await checkAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { listing_id, action } = await req.json()
  const supabase = await createServiceClient()

  if (action === 'remove') {
    await supabase.from('listings').update({ status: 'removed' }).eq('id', listing_id)
  } else if (action === 'restore') {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    await supabase.from('listings').update({
      status: 'active',
      posted_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    }).eq('id', listing_id)
  } else if (action === 'activate') {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    await supabase.from('listings').update({
      status: 'active',
      expires_at: expiresAt.toISOString(),
    }).eq('id', listing_id)
  } else if (action === 'deactivate') {
    await supabase.from('listings').update({ status: 'archived' }).eq('id', listing_id)
  }

  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  return auth?.value === process.env.ADMIN_PASSWORD
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  }

  return NextResponse.json({ ok: true })
}

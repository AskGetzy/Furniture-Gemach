import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { listing_id, reason } = await req.json()
  if (!listing_id || !reason?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const supabase = await createClient()
  await supabase.from('flags').insert({ listing_id, reason })
  return NextResponse.json({ ok: true })
}

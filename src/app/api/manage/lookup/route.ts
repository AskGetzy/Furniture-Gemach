import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pin = searchParams.get('pin')?.toUpperCase()
  if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 })

  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('id, title, type, area, category, status, posted_at, expires_at, photo_urls, description, price, views')
    .eq('pin_code', pin)
    .neq('status', 'removed')
    .single()

  if (!data) return NextResponse.json({ error: 'No listing found with that PIN' }, { status: 404 })
  return NextResponse.json({ listing: data })
}

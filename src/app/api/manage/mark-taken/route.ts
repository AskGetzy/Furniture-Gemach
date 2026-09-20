import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { pin_code } = await req.json()
  if (!pin_code) return NextResponse.json({ error: 'PIN required' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .update({ status: 'taken' })
    .eq('pin_code', pin_code.toUpperCase())
    .eq('status', 'active')
    .select('id')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Listing not found or not active' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

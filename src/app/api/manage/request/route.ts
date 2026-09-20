import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminListingRequest } from '@/lib/email'

export async function POST(req: Request) {
  const { pin_code, type, message } = await req.json()
  if (!pin_code || !type || !message?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (type !== 'removal' && type !== 'change') {
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('id, title, poster_name, poster_email')
    .eq('pin_code', pin_code.toUpperCase())
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  await sendAdminListingRequest({
    listingId: listing.id,
    listingTitle: listing.title,
    posterName: listing.poster_name,
    posterEmail: listing.poster_email,
    requestType: type,
    message: message.trim(),
  })

  return NextResponse.json({ ok: true })
}

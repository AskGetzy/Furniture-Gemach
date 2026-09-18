import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICES } from '@/lib/stripe'

export async function POST(req: Request) {
  const { listing_id, pin_code } = await req.json()
  if (!listing_id || !pin_code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listing_id)
    .eq('pin_code', pin_code.toUpperCase())
    .single()

  if (!listing) return NextResponse.json({ error: 'Invalid PIN or listing not found' }, { status: 404 })
  if (listing.type !== 'sale') return NextResponse.json({ error: 'Only sale listings can be renewed' }, { status: 400 })
  if (!['active', 'expired'].includes(listing.status)) {
    return NextResponse.json({ error: 'This listing cannot be renewed' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: PRICES.renewal,
        product_data: {
          name: "Zeh M'zeh — Listing Renewal (30 days)",
          description: listing.title,
        },
      },
      quantity: 1,
    }],
    metadata: { listing_id, type: 'renewal_fee', pin_code },
    customer_email: listing.poster_email,
    success_url: `${appUrl}/listings/${listing_id}?renewed=1`,
    cancel_url: `${appUrl}/listings/${listing_id}`,
  })

  return NextResponse.json({ url: session.url })
}

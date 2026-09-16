import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICES } from '@/lib/stripe'
import { generatePinCode } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      type, area, category, title, description, price,
      photo_urls, poster_name, poster_email, poster_phone, poster_address,
    } = body

    if (!type || !area || !category || !title || !description || !poster_name || !poster_email || !poster_phone || !poster_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!photo_urls || photo_urls.length < 2) {
      return NextResponse.json({ error: 'At least 2 photos required' }, { status: 400 })
    }
    if (type === 'sale' && (!price || price <= 0)) {
      return NextResponse.json({ error: 'Price required for sale listings' }, { status: 400 })
    }

    const supabase = await createClient()
    const pinCode = generatePinCode()

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        type, area, category, title, description,
        price: type === 'sale' ? price : null,
        photo_urls,
        poster_name, poster_email, poster_phone, poster_address,
        pin_code: pinCode,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: error?.message || 'Failed to create listing' }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const amount = PRICES[type as keyof typeof PRICES]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: `Furniture Gemach — ${type === 'giveaway' ? 'Giveaway' : 'For Sale'} Listing Fee`,
            description: title,
          },
        },
        quantity: 1,
      }],
      metadata: { listing_id: listing.id, type: 'listing_fee', pin_code: pinCode },
      customer_email: poster_email,
      success_url: `${appUrl}/post/success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}`,
      cancel_url: `${appUrl}/post`,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err: unknown) {
    console.error('Create listing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

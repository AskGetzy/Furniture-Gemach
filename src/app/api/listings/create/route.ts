import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getStripe, getPrices } from '@/lib/stripe'
import { generatePinCode } from '@/lib/utils'
import { sendListingConfirmation, sendAdminNewListingNotification } from '@/lib/email'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // skip if not configured
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      type, area, categories, title, description, price,
      photo_urls, poster_name, poster_email, poster_phone, poster_address,
      turnstile_token,
    } = body

    if (!type || !area || !categories?.length || !title || !description || !poster_name || !poster_email || !poster_phone || !poster_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!photo_urls || photo_urls.length < 2) {
      return NextResponse.json({ error: 'At least 2 photos required' }, { status: 400 })
    }
    if (type === 'sale' && (!price || price <= 0)) {
      return NextResponse.json({ error: 'Price required for sale listings' }, { status: 400 })
    }

    if (turnstile_token) {
      const valid = await verifyTurnstile(turnstile_token)
      if (!valid) return NextResponse.json({ error: 'Anti-spam check failed. Please try again.' }, { status: 400 })
    }

    const prices = getPrices()
    const listingFee = prices[type as keyof typeof prices] ?? 0
    const isFree = listingFee === 0
    const pinCode = generatePinCode()

    if (isFree) {
      // Activate immediately — no payment needed
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const serviceSupabase = await createServiceClient()

      const { data: listing, error } = await serviceSupabase
        .from('listings')
        .insert({
          type, area, categories,
          category: categories[0], // legacy column
          title, description,
          price: type === 'sale' ? price : null,
          photo_urls,
          poster_name, poster_email, poster_phone, poster_address,
          pin_code: pinCode,
          status: 'active',
          posted_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error || !listing) {
        return NextResponse.json({ error: error?.message || 'Failed to create listing' }, { status: 500 })
      }

      try {
        await sendListingConfirmation({
          to: poster_email,
          posterName: poster_name,
          listingTitle: title,
          pinCode,
          listingId: listing.id,
          expiresAt: listing.expires_at!,
        })
        await sendAdminNewListingNotification({
          listingTitle: title,
          listingId: listing.id,
          posterName: poster_name,
          posterEmail: poster_email,
          type,
          area,
        })
      } catch (emailErr) {
        console.error('Email error:', emailErr)
      }

      return NextResponse.json({ listingId: listing.id, free: true })
    }

    // Paid listing — create draft and Stripe checkout
    const supabase = await createClient()
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        type, area, categories,
        category: categories[0], // legacy column
        title, description,
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

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: listingFee,
          product_data: {
            name: `Zeh M'zeh — ${type === 'giveaway' ? 'Giveaway' : 'For Sale'} Listing Fee`,
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

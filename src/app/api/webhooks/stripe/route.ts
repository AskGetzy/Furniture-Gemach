import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendListingConfirmation, sendAdminNewListingNotification } from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: Record<string, string>; payment_intent?: string; customer_email?: string; amount_total?: number }
    const { listing_id, type: paymentType, pin_code } = session.metadata || {}
    if (!listing_id) return NextResponse.json({ received: true })

    const supabase = await createServiceClient()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    if (paymentType === 'listing_fee') {
      const { data: listing } = await supabase
        .from('listings')
        .update({
          status: 'active',
          posted_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        })
        .eq('id', listing_id)
        .select()
        .single()

      if (listing && session.payment_intent) {
        await supabase.from('payments').insert({
          listing_id,
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : String(session.payment_intent),
          amount: session.amount_total || 0,
          type: 'listing_fee',
          status: 'succeeded',
        })

        try {
          await sendListingConfirmation({
            to: listing.poster_email,
            posterName: listing.poster_name,
            listingTitle: listing.title,
            pinCode: pin_code || listing.pin_code,
            listingId: listing.id,
            expiresAt: listing.expires_at!,
          })
          await sendAdminNewListingNotification({
            listingTitle: listing.title,
            listingId: listing.id,
            posterName: listing.poster_name,
            posterEmail: listing.poster_email,
            type: listing.type,
            area: listing.area,
          })
        } catch (emailErr) {
          console.error('Email error:', emailErr)
        }
      }
    } else if (paymentType === 'renewal_fee') {
      const { data: listing } = await supabase
        .from('listings')
        .select('expires_at')
        .eq('id', listing_id)
        .single()

      const currentExpiry = listing?.expires_at ? new Date(listing.expires_at) : new Date()
      const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()) + 30 * 24 * 60 * 60 * 1000)

      await supabase
        .from('listings')
        .update({ status: 'active', expires_at: newExpiry.toISOString() })
        .eq('id', listing_id)

      if (session.payment_intent) {
        await supabase.from('payments').insert({
          listing_id,
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : String(session.payment_intent),
          amount: session.amount_total || 0,
          type: 'renewal_fee',
          status: 'succeeded',
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}

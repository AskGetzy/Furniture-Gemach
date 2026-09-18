import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === process.env.ADMIN_PASSWORD
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payment_id, stripe_payment_intent_id } = await req.json()
  if (!payment_id || !stripe_payment_intent_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const refund = await getStripe().refunds.create({ payment_intent: stripe_payment_intent_id })
    const supabase = await createServiceClient()
    await supabase.from('payments').update({
      refunded: true,
      refunded_at: new Date().toISOString(),
      stripe_refund_id: refund.id,
    }).eq('id', payment_id)
    return NextResponse.json({ ok: true, refund_id: refund.id })
  } catch (err: unknown) {
    console.error('Refund error:', err)
    return NextResponse.json({ error: 'Refund failed' }, { status: 500 })
  }
}

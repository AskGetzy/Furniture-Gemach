'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RefundButton({
  paymentId, amount, stripePaymentIntentId,
}: { paymentId: string; amount: number; stripePaymentIntentId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter()

  async function handleRefund() {
    setLoading(true)
    const res = await fetch('/api/admin/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_id: paymentId, stripe_payment_intent_id: stripePaymentIntentId }),
    })
    setLoading(false)
    if (res.ok) router.refresh()
    else alert('Refund failed')
  }

  if (!confirm) {
    return (
      <button onClick={() => setConfirm(true)} className="text-xs bg-yellow-800/50 hover:bg-yellow-700/60 text-yellow-300 px-2 py-1 rounded transition-colors">
        Refund ${(amount / 100).toFixed(2)}
      </button>
    )
  }

  return (
    <div className="flex gap-1">
      <button onClick={handleRefund} disabled={loading} className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50">
        {loading ? '…' : 'Confirm'}
      </button>
      <button onClick={() => setConfirm(false)} className="text-xs text-gray-500 px-1">Cancel</button>
    </div>
  )
}

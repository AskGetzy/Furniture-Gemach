import { createServiceClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import RefundButton from './RefundButton'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Payments' }

export default async function AdminPaymentsPage() {
  const supabase = await createServiceClient()

  const { data: payments } = await supabase
    .from('payments')
    .select(`*, listings(title, poster_name, poster_email, type, area)`)
    .order('created_at', { ascending: false })
    .limit(100)

  const total = payments?.reduce((sum, p) => sum + (p.refunded ? 0 : p.amount), 0) || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Payment History</h1>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total revenue (non-refunded)</p>
          <p className="text-lg font-bold text-emerald-400">${(total / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Listing</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments?.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-900/50">
                <td className="px-4 py-3">
                  <a href={`/listings/${p.listing_id}`} target="_blank" className="text-white hover:text-emerald-400 font-medium text-xs line-clamp-1">
                    {p.listings?.title || p.listing_id}
                  </a>
                  <div className="text-gray-500 text-xs">{p.listings?.poster_name} · {p.listings?.poster_email}</div>
                </td>
                <td className="px-4 py-3 text-white font-medium">${(p.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.type.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3">
                  {p.refunded ? (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Refunded</span>
                  ) : (
                    <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">Paid</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {!p.refunded && (
                    <RefundButton paymentId={p.id} amount={p.amount} stripePaymentIntentId={p.stripe_payment_intent_id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

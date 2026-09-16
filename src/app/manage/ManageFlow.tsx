'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/supabase/types'
import { formatDate, daysUntilExpiry } from '@/lib/utils'

type Listing = {
  id: string; title: string; type: string; area: string; category: string
  status: string; posted_at: string | null; expires_at: string | null
  photo_urls: string[]; description: string; price: number | null; views: number
}

export default function ManageFlow() {
  const searchParams = useSearchParams()
  const [pin, setPin] = useState(searchParams.get('pin') || '')
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [action, setAction] = useState<null | 'remove' | 'removed'>(null)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    if (searchParams.get('pin')) lookup(searchParams.get('pin')!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function lookup(pinValue?: string) {
    const code = (pinValue || pin).trim().toUpperCase()
    if (!code) return
    setLoading(true)
    setError('')
    setListing(null)
    const res = await fetch(`/api/manage/lookup?pin=${code}`)
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Not found'); return }
    setListing(data.listing)
  }

  async function removeListing() {
    setRemoving(true)
    const res = await fetch('/api/manage/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: pin.toUpperCase() }),
    })
    setRemoving(false)
    if (res.ok) setAction('removed')
    else setError('Failed to remove listing')
  }

  if (action === 'removed') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="font-bold text-gray-900 mb-2">Listing removed</h2>
        <p className="text-gray-500 text-sm mb-4">Your listing has been taken down.</p>
        <Link href="/" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* PIN entry */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">PIN code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pin}
            onChange={e => setPin(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            maxLength={8}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyDown={e => e.key === 'Enter' && lookup()}
          />
          <button
            onClick={() => lookup()}
            disabled={loading}
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? '…' : 'Find'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Listing details */}
      {listing && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {listing.photo_urls.length > 0 && (
            <div className="relative h-48">
              <Image src={listing.photo_urls[0]} alt={listing.title} fill className="object-cover" sizes="600px" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${listing.type === 'giveaway' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                {listing.type === 'giveaway' ? 'Giveaway' : 'For Sale'}
              </span>
              <span className="text-xs text-gray-400 capitalize">{listing.status.replace('_', ' ')}</span>
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-1">{listing.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{listing.area} · {CATEGORY_LABELS[listing.category as keyof typeof CATEGORY_LABELS]}</p>

            {listing.status === 'active' && (
              <div className="bg-emerald-50 rounded-lg p-3 text-sm text-emerald-800 mb-3">
                <strong>Active</strong> · Expires {formatDate(listing.expires_at)} ({daysUntilExpiry(listing.expires_at)} days left)
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Link
                href={`/listings/${listing.id}`}
                className="w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                View public listing
              </Link>

              {listing.status === 'active' && (
                <>
                  {action === 'remove' ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800 font-medium mb-3">Are you sure you want to remove this listing?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={removeListing}
                          disabled={removing}
                          className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                        >
                          {removing ? 'Removing…' : 'Yes, remove it'}
                        </button>
                        <button onClick={() => setAction(null)} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAction('remove')}
                      className="w-full bg-red-50 text-red-700 border border-red-200 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Remove this listing
                    </button>
                  )}
                </>
              )}

              {listing.status === 'expired' && listing.type === 'sale' && (
                <Link
                  href={`/listings/${listing.id}`}
                  className="w-full text-center bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Renew for $5 →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

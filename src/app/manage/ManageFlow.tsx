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

type Panel = null | 'taken-confirm' | 'request-removal' | 'request-change'
type Done = null | 'taken' | 'request-sent'

export default function ManageFlow() {
  const searchParams = useSearchParams()
  const [pin, setPin] = useState(searchParams.get('pin') || '')
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [panel, setPanel] = useState<Panel>(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<Done>(null)

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
    setPanel(null)
    setDone(null)
    const res = await fetch(`/api/manage/lookup?pin=${code}`)
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Not found'); return }
    setListing(data.listing)
  }

  async function markTaken() {
    setSubmitting(true)
    const res = await fetch('/api/manage/mark-taken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: pin.toUpperCase() }),
    })
    setSubmitting(false)
    if (res.ok) { setDone('taken'); setListing(prev => prev ? { ...prev, status: 'taken' } : prev) }
    else setError('Failed to mark as taken')
  }

  async function sendRequest(type: 'removal' | 'change') {
    if (!message.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/manage/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: pin.toUpperCase(), type, message }),
    })
    setSubmitting(false)
    if (res.ok) { setDone('request-sent'); setPanel(null) }
    else setError('Failed to send request')
  }

  if (done === 'taken') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="font-bold text-gray-900 mb-2">Marked as taken</h2>
        <p className="text-gray-500 text-sm mb-4">Your listing is still visible so people know the item existed, but contact info is now hidden.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/listings/${listing?.id}`} className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200">View listing</Link>
          <Link href="/" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700">Back to home</Link>
        </div>
      </div>
    )
  }

  if (done === 'request-sent') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-3">📬</div>
        <h2 className="font-bold text-gray-900 mb-2">Request sent</h2>
        <p className="text-gray-500 text-sm mb-4">The admin has been notified and will follow up by email.</p>
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

            {listing.status === 'taken' && (
              <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600 mb-3 text-center font-medium uppercase tracking-wider">
                This item has been taken
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
                  {panel === 'taken-confirm' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-800 font-medium mb-1">Mark this item as taken?</p>
                      <p className="text-xs text-gray-500 mb-3">The listing stays visible so people can see it existed, but your contact info will be hidden.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={markTaken}
                          disabled={submitting}
                          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {submitting ? 'Saving…' : 'Yes, mark as taken'}
                        </button>
                        <button onClick={() => setPanel(null)} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {panel === 'request-removal' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800 font-medium mb-2">Request removal</p>
                      <p className="text-xs text-red-700 mb-3">Tell us why you need this listing removed. The admin will review and take action.</p>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Reason for removal…"
                        rows={3}
                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendRequest('removal')}
                          disabled={submitting || !message.trim()}
                          className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                        >
                          {submitting ? 'Sending…' : 'Send request'}
                        </button>
                        <button onClick={() => { setPanel(null); setMessage('') }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {panel === 'request-change' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800 font-medium mb-2">Request a change</p>
                      <p className="text-xs text-blue-700 mb-3">Describe what you'd like updated. The admin will make the change for you.</p>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="What should be changed?…"
                        rows={3}
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendRequest('change')}
                          disabled={submitting || !message.trim()}
                          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submitting ? 'Sending…' : 'Send request'}
                        </button>
                        <button onClick={() => { setPanel(null); setMessage('') }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {panel === null && (
                    <>
                      <button
                        onClick={() => setPanel('taken-confirm')}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Mark as taken
                      </button>
                      <button
                        onClick={() => { setPanel('request-change'); setMessage('') }}
                        className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        Request a change
                      </button>
                      <button
                        onClick={() => { setPanel('request-removal'); setMessage('') }}
                        className="w-full bg-red-50 text-red-700 border border-red-200 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Request removal
                      </button>
                    </>
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

              {(listing.status === 'expired' || listing.status === 'taken') && (
                <>
                  {panel === 'request-removal' ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800 font-medium mb-2">Request removal</p>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Reason for removal…"
                        rows={3}
                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendRequest('removal')}
                          disabled={submitting || !message.trim()}
                          className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                        >
                          {submitting ? 'Sending…' : 'Send request'}
                        </button>
                        <button onClick={() => { setPanel(null); setMessage('') }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : panel === null && (
                    <button
                      onClick={() => { setPanel('request-removal'); setMessage('') }}
                      className="w-full bg-red-50 text-red-700 border border-red-200 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Request removal
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

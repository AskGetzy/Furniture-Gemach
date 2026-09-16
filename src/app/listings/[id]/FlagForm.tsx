'use client'
import { useState } from 'react'
import { Flag } from 'lucide-react'

export default function FlagForm({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!reason.trim()) return
    setLoading(true)
    await fetch('/api/flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, reason }),
    })
    setDone(true)
    setLoading(false)
  }

  if (done) return <p className="text-sm text-gray-400 mt-4">Thank you for your report.</p>

  return (
    <div className="mt-4">
      {!open ? (
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
          <Flag size={12} /> Report this listing
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-800 mb-2">Report this listing</p>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Describe the issue..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-2"
          />
          <div className="flex gap-2">
            <button onClick={submit} disabled={loading} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50">
              {loading ? 'Sending...' : 'Submit report'}
            </button>
            <button onClick={() => setOpen(false)} className="text-gray-500 text-xs px-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

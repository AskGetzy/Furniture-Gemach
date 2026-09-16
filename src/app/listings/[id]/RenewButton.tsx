'use client'
import { useState } from 'react'

export default function RenewButton({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [loading, setLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  async function handleRenew() {
    if (!pin.trim()) { setError('Please enter your PIN code'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, pin_code: pin }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error creating checkout'); setLoading(false); return }
      window.location.href = data.url
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
      <h3 className="font-semibold text-blue-800 mb-1">Renew this listing — $5</h3>
      <p className="text-sm text-blue-700 mb-3">Extend your listing for another 30 days.</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Your PIN code"
          value={pin}
          onChange={e => setPin(e.target.value.toUpperCase())}
          maxLength={8}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRenew}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading...' : 'Renew →'}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  )
}

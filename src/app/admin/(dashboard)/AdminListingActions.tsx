'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminListingActions({ listingId, status }: { listingId: string; status: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function act(action: string) {
    setLoading(true)
    await fetch('/api/admin/listing-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, action }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {status !== 'removed' && (
        <button onClick={() => act('remove')} disabled={loading} className="text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Remove
        </button>
      )}
      {status === 'expired' && (
        <button onClick={() => act('restore')} disabled={loading} className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Restore
        </button>
      )}
    </div>
  )
}

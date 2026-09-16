'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminFlagActions({ flagId, listingId }: { flagId: string; listingId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function act(action: 'resolve' | 'resolve_remove') {
    setLoading(true)
    await fetch('/api/admin/flag-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag_id: flagId, listing_id: listingId, action }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-1.5">
      <button onClick={() => act('resolve')} disabled={loading} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
        Dismiss
      </button>
      <button onClick={() => act('resolve_remove')} disabled={loading} className="text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
        Remove listing
      </button>
    </div>
  )
}

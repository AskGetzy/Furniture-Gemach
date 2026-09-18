'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminEditModal from './AdminEditModal'
import type { Listing } from '@/lib/supabase/types'

export default function AdminListingActions({ listing }: { listing: Listing }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function act(action: string) {
    setLoading(true)
    await fetch('/api/admin/listing-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listing.id, action }),
    })
    setLoading(false)
    router.refresh()
  }

  const { status } = listing

  return (
    <div className="flex gap-1.5 flex-wrap">
      <AdminEditModal listing={listing} />
      {status === 'active' && (
        <button onClick={() => act('deactivate')} disabled={loading} className="text-xs bg-yellow-800 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Deactivate
        </button>
      )}
      {(status === 'archived' || status === 'expired' || status === 'pending_payment') && (
        <button onClick={() => act('activate')} disabled={loading} className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Activate
        </button>
      )}
      {status !== 'removed' && (
        <button onClick={() => act('remove')} disabled={loading} className="text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Remove
        </button>
      )}
      {status === 'removed' && (
        <button onClick={() => act('activate')} disabled={loading} className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50">
          Restore
        </button>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import type { Listing, ListingArea, ListingCategory } from '@/lib/supabase/types'
import { AREAS, CATEGORIES } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function GiveawaysBrowser() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [area, setArea] = useState<ListingArea | ''>(
    (searchParams.get('area') as ListingArea) || ''
  )
  const [category, setCategory] = useState<ListingCategory | ''>(
    (searchParams.get('category') as ListingCategory) || ''
  )

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('listings')
      .select('*')
      .eq('type', 'giveaway')
      .eq('status', 'active')
      .order('posted_at', { ascending: false })

    if (area) query = query.eq('area', area)
    if (category) query = query.eq('category', category)

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }, [area, category])

  useEffect(() => { fetchListings() }, [fetchListings])

  function updateFilter(newArea: typeof area, newCat: typeof category) {
    const params = new URLSearchParams()
    if (newArea) params.set('area', newArea)
    if (newCat) params.set('category', newCat)
    router.push(`/giveaways?${params.toString()}`, { scroll: false })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={area}
          onChange={e => { setArea(e.target.value as typeof area); updateFilter(e.target.value as typeof area, category) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Areas</option>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={category}
          onChange={e => { setCategory(e.target.value as typeof category); updateFilter(area, e.target.value as typeof category) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        {(area || category) && (
          <button
            onClick={() => { setArea(''); setCategory(''); router.push('/giveaways', { scroll: false }) }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">No giveaways found</p>
          <p className="text-sm mt-1">Try changing your filters or check back soon.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import type { Listing, ListingArea, ListingCategory } from '@/lib/supabase/types'
import { AREAS, CATEGORIES } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest'

export default function SalesBrowser() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [area, setArea] = useState<ListingArea | ''>((searchParams.get('area') as ListingArea) || '')
  const [category, setCategory] = useState<ListingCategory | ''>((searchParams.get('category') as ListingCategory) || '')
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('listings')
      .select('*')
      .eq('type', 'sale')
      .in('status', ['active', 'taken'])

    if (area) query = query.eq('area', area)
    if (category) query = query.overlaps('categories', [category])

    const sortMap: Record<SortOption, { col: string; asc: boolean }> = {
      price_asc: { col: 'price', asc: true },
      price_desc: { col: 'price', asc: false },
      newest: { col: 'posted_at', asc: false },
      oldest: { col: 'posted_at', asc: true },
    }
    const { col, asc } = sortMap[sort]
    query = query.order(col, { ascending: asc })

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }, [area, category, sort])

  useEffect(() => { fetchListings() }, [fetchListings])

  function updateFilter(a: typeof area, c: typeof category, s: SortOption) {
    const params = new URLSearchParams()
    if (a) params.set('area', a)
    if (c) params.set('category', c)
    if (s !== 'newest') params.set('sort', s)
    router.push(`/sales?${params.toString()}`, { scroll: false })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={area}
          onChange={e => { const v = e.target.value as typeof area; setArea(v); updateFilter(v, category, sort) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Areas</option>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={category}
          onChange={e => { const v = e.target.value as typeof category; setCategory(v); updateFilter(area, v, sort) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <select
          value={sort}
          onChange={e => { const v = e.target.value as SortOption; setSort(v); updateFilter(area, category, v) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        {(area || category) && (
          <button
            onClick={() => { setArea(''); setCategory(''); setSort('newest'); router.push('/sales', { scroll: false }) }}
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
          <p className="font-medium">No listings found</p>
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

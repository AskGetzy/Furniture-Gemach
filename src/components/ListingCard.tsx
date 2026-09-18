'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Calendar, Eye, Flag } from 'lucide-react'
import type { Listing } from '@/lib/supabase/types'
import { CATEGORY_LABELS, AREAS } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'

interface Props {
  listing: Listing
  showContact?: boolean
}

export default function ListingCard({ listing, showContact = false }: Props) {
  const [revealPhone, setRevealPhone] = useState(false)
  const [revealEmail, setRevealEmail] = useState(false)
  const [flagging, setFlagging] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [flagged, setFlagged] = useState(false)

  const isGiveaway = listing.type === 'giveaway'

  async function handleFlag() {
    if (!flagReason.trim()) return
    try {
      await fetch('/api/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id, reason: flagReason }),
      })
      setFlagged(true)
      setFlagging(false)
    } catch {}
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
      {/* Photos */}
      <div className="relative h-48 bg-gray-100">
        {listing.photo_urls.length > 0 ? (
          <Image
            src={listing.photo_urls[0]}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No photo</div>
        )}
        {/* Badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
          isGiveaway ? 'bg-emerald-500' : 'bg-blue-500'
        }`}>
          {isGiveaway ? 'FREE' : 'For Sale'}
        </div>
        {listing.photo_urls.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
            +{listing.photo_urls.length - 1} more
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/listings/${listing.id}`} className="font-semibold text-gray-900 hover:text-emerald-700 line-clamp-2 text-sm leading-snug flex-1">
            {listing.title}
          </Link>
          {!isGiveaway && listing.price && (
            <span className="text-blue-700 font-bold text-sm whitespace-nowrap">${listing.price.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={11} />
          <span>{listing.area}</span>
          <span className="mx-1">·</span>
          <span>{(listing.categories?.length ? listing.categories : [listing.category]).map(c => CATEGORY_LABELS[c]).join(', ')}</span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1">{listing.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={11} />
            <span>{formatDate(listing.posted_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={11} />
            <span>{listing.views}</span>
          </div>
        </div>

        {/* Contact reveal */}
        <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3">
          <button
            onClick={() => setRevealPhone(!revealPhone)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-emerald-700 transition-colors"
          >
            <Phone size={13} />
            {revealPhone ? listing.poster_phone : 'Show phone number'}
          </button>
          <button
            onClick={() => setRevealEmail(!revealEmail)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-emerald-700 transition-colors"
          >
            <Mail size={13} />
            {revealEmail ? listing.poster_email : 'Show email'}
          </button>
        </div>

        {/* Flag */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          {flagged ? (
            <p className="text-xs text-gray-400">Reported. Thank you.</p>
          ) : flagging ? (
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Reason..."
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1"
              />
              <button onClick={handleFlag} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600">Send</button>
              <button onClick={() => setFlagging(false)} className="text-xs text-gray-400 px-1">✕</button>
            </div>
          ) : (
            <button onClick={() => setFlagging(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
              <Flag size={11} />
              Report listing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

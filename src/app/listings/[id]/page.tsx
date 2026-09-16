import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORY_LABELS, type ListingCategory } from '@/lib/supabase/types'
import { formatDate, daysUntilExpiry } from '@/lib/utils'
import ContactReveal from './ContactReveal'
import RenewButton from './RenewButton'
import FlagForm from './FlagForm'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('listings').select('title, description').eq('id', id).single()
  if (!data) return { title: 'Listing Not Found' }
  return {
    title: `${data.title} — Furniture Gemach`,
    description: data.description?.slice(0, 160),
  }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .in('status', ['active', 'expired'])
    .single()

  if (!listing) notFound()

  // Increment views (fire and forget)
  supabase.from('listings').update({ views: listing.views + 1 }).eq('id', id).then(() => {})

  const isGiveaway = listing.type === 'giveaway'
  const daysLeft = daysUntilExpiry(listing.expires_at)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href={isGiveaway ? '/giveaways' : '/sales'} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to {isGiveaway ? 'Giveaways' : 'For Sale'}
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Photos grid */}
        {listing.photo_urls.length > 0 && (
          <div className={`grid gap-1 ${listing.photo_urls.length === 1 ? '' : 'grid-cols-2'}`}>
            <div className="relative h-72">
              <Image src={listing.photo_urls[0]} alt={listing.title} fill className="object-cover" sizes="800px" />
            </div>
            {listing.photo_urls.slice(1, 3).map((url: string, i: number) => (
              <div key={i} className="relative h-36">
                <Image src={url} alt={`${listing.title} ${i + 2}`} fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${isGiveaway ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                  {isGiveaway ? 'FREE — Giveaway' : 'For Sale'}
                </span>
                {(listing.categories?.length ? listing.categories : [listing.category as ListingCategory]).map((c: ListingCategory) => (
                  <span key={c} className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {CATEGORY_LABELS[c]}
                  </span>
                ))}
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {listing.area}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            </div>
            {!isGiveaway && listing.price && (
              <div className="text-2xl font-bold text-blue-700">${listing.price.toLocaleString()}</div>
            )}
          </div>

          {listing.status === 'expired' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              This listing has expired. {!isGiveaway && 'The seller may be able to renew it.'}
            </div>
          )}

          {listing.status === 'active' && daysLeft <= 3 && daysLeft > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
              This listing expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}.
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{listing.description}</p>
          </div>

          {/* Contact */}
          {listing.status === 'active' && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">Contact</h2>
              <p className="text-sm text-gray-600 mb-3">
                Posted by <strong>{listing.poster_name}</strong> — click to reveal contact info.
              </p>
              <ContactReveal phone={listing.poster_phone} email={listing.poster_email} />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4 mb-4">
            <span>Posted {formatDate(listing.posted_at)}</span>
            {listing.expires_at && listing.status === 'active' && (
              <span>Expires {formatDate(listing.expires_at)}</span>
            )}
            <span>{listing.views} views</span>
          </div>

          {/* Renew for sale expired */}
          {listing.status === 'expired' && !isGiveaway && (
            <RenewButton listingId={listing.id} listingTitle={listing.title} />
          )}

          <FlagForm listingId={listing.id} />
        </div>
      </div>
    </div>
  )
}

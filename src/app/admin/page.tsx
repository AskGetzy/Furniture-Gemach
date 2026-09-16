import { createServiceClient } from '@/lib/supabase/server'
import { CATEGORY_LABELS } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'
import AdminListingActions from './AdminListingActions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — All Listings' }

export default async function AdminPage() {
  const supabase = await createServiceClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-900/40 text-emerald-300',
    pending_payment: 'bg-yellow-900/40 text-yellow-300',
    expired: 'bg-gray-800 text-gray-400',
    archived: 'bg-gray-800 text-gray-500',
    removed: 'bg-red-900/40 text-red-400',
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">All Listings ({listings?.length || 0})</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Area</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Posted</th>
              <th className="px-4 py-3 text-left">Poster</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {listings?.map(l => (
              <tr key={l.id} className="hover:bg-gray-900/50 transition-colors">
                <td className="px-4 py-3">
                  <a href={`/listings/${l.id}`} target="_blank" className="text-white hover:text-emerald-400 transition-colors font-medium line-clamp-1 max-w-48 block">
                    {l.title}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${l.type === 'giveaway' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-400'}`}>
                    {l.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">{l.area}</td>
                <td className="px-4 py-3 text-gray-400">{CATEGORY_LABELS[l.category as keyof typeof CATEGORY_LABELS]}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status] || 'text-gray-400'}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(l.posted_at)}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-300 text-xs">{l.poster_name}</div>
                  <div className="text-gray-500 text-xs">{l.poster_email}</div>
                </td>
                <td className="px-4 py-3">
                  <AdminListingActions listingId={l.id} status={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

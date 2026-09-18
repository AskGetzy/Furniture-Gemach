import { createServiceClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import AdminFlagActions from './AdminFlagActions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Flags' }

export default async function AdminFlagsPage() {
  const supabase = await createServiceClient()

  const { data: flags } = await supabase
    .from('flags')
    .select(`*, listings(title, status, area, type)`)
    .order('created_at', { ascending: false })
    .limit(100)

  const open = flags?.filter(f => !f.resolved) || []
  const resolved = flags?.filter(f => f.resolved) || []

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Flagged Listings</h1>

      <h2 className="text-sm font-semibold text-yellow-400 mb-3">Open ({open.length})</h2>
      <FlagTable flags={open} />

      {resolved.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 mt-8 mb-3">Resolved ({resolved.length})</h2>
          <FlagTable flags={resolved} resolved />
        </>
      )}
    </div>
  )
}

function FlagTable({ flags, resolved = false }: { flags: any[]; resolved?: boolean }) {
  if (!flags.length) return <p className="text-gray-600 text-sm mb-4">None.</p>
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 mb-6">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Listing</th>
            <th className="px-4 py-3 text-left">Reason</th>
            <th className="px-4 py-3 text-left">Flagged</th>
            {!resolved && <th className="px-4 py-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {flags.map((f: any) => (
            <tr key={f.id} className="hover:bg-gray-900/50">
              <td className="px-4 py-3">
                <a href={`/listings/${f.listing_id}`} target="_blank" className="text-white hover:text-emerald-400 font-medium text-xs line-clamp-1">
                  {f.listings?.title || f.listing_id}
                </a>
                <div className="text-gray-500 text-xs">{f.listings?.area} · {f.listings?.type} · {f.listings?.status}</div>
              </td>
              <td className="px-4 py-3 text-gray-300 text-xs max-w-xs">{f.reason}</td>
              <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(f.created_at)}</td>
              {!resolved && (
                <td className="px-4 py-3">
                  <AdminFlagActions flagId={f.id} listingId={f.listing_id} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

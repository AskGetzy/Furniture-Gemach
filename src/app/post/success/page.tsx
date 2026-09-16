import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export const metadata = { title: 'Listing Live! — Furniture Gemach' }

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ listing_id?: string }>
}) {
  const { listing_id } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <CheckCircle className="mx-auto mb-4 text-emerald-500" size={52} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your listing is live!</h1>
        <p className="text-gray-600 text-sm mb-4">
          Payment successful. Your listing is now active and visible to the community.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          We've sent a confirmation email with your <strong>PIN code</strong> — save it to manage or remove your listing early.
        </p>
        <div className="flex flex-col gap-3">
          {listing_id && (
            <Link
              href={`/listings/${listing_id}`}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              View your listing
            </Link>
          )}
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Back to home
          </Link>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 mt-6">
          Remember to take your listing down once the item is gone!
        </p>
      </div>
    </div>
  )
}

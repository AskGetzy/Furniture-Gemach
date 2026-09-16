import { Suspense } from 'react'
import SalesBrowser from './SalesBrowser'

export const metadata = {
  title: 'Furniture For Sale — Furniture Gemach',
  description: 'Browse affordable furniture for sale from community members in Monsey, Monroe, Brooklyn, and Lakewood.',
}

export default function SalesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
          🏷️ For Sale
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Furniture For Sale</h1>
        <p className="text-gray-500 mt-1">Quality furniture at community prices.</p>
      </div>
      <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
        <SalesBrowser />
      </Suspense>
    </div>
  )
}

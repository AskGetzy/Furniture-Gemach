import { Suspense } from 'react'
import { Gift } from 'lucide-react'
import GiveawaysBrowser from './GiveawaysBrowser'

export const metadata = {
  title: "Free Furniture Giveaways — Zeh M'zeh",
  description: 'Browse free furniture giveaways from community members in Monsey, Monroe, Brooklyn, and Lakewood.',
}

export default function GiveawaysPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
          <Gift size={14} /> Free Items
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Furniture Giveaways</h1>
        <p className="text-gray-500 mt-1">Community members giving away furniture — completely free.</p>
      </div>
      <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
        <GiveawaysBrowser />
      </Suspense>
    </div>
  )
}

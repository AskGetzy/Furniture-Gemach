import { Suspense } from 'react'
import ManageFlow from './ManageFlow'

export const metadata = { title: "Manage Your Listing — Zeh M'zeh" }

export default function ManagePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Listing</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your PIN code to view, edit, or remove your listing.</p>
        <Suspense fallback={null}>
          <ManageFlow />
        </Suspense>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { checkAdminSession } from '@/lib/admin-auth'
import LogoutButton from '../LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdminSession()
  if (!isAdmin) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-emerald-400">🛋️ Admin</span>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">Listings</Link>
          <Link href="/admin/flags" className="text-sm text-gray-400 hover:text-white transition-colors">Flags</Link>
          <Link href="/admin/payments" className="text-sm text-gray-400 hover:text-white transition-colors">Payments</Link>
        </div>
        <LogoutButton />
      </nav>
      <div className="p-6">{children}</div>
    </div>
  )
}

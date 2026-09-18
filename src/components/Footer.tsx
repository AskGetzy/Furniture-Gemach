import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🛋️</span>
            <span className="font-semibold text-gray-800">Zeh M'zeh</span>
          </div>
          <span dir="rtl" className="block text-xs text-emerald-600 font-medium mb-2">זה מזה</span>
          <p className="text-xs text-gray-500">Community furniture giveaways and sales for Jewish communities.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Browse</p>
          <div className="flex flex-col gap-1">
            <Link href="/giveaways" className="hover:text-emerald-700">Giveaways</Link>
            <Link href="/sales" className="hover:text-emerald-700">For Sale</Link>
            <Link href="/post" className="hover:text-emerald-700">Post a Listing</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Account</p>
          <div className="flex flex-col gap-1">
            <Link href="/manage" className="hover:text-emerald-700">Manage Listing</Link>
            <Link href="/contact" className="hover:text-emerald-700">Contact Us</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Legal</p>
          <div className="flex flex-col gap-1">
            <Link href="/about" className="hover:text-emerald-700">About Us</Link>
            <Link href="/terms" className="hover:text-emerald-700">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Zeh M'zeh. All rights reserved.
      </div>
    </footer>
  )
}

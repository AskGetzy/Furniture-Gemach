'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'border-b border-gray-200 shadow-md'
        : 'border-b border-transparent shadow-none'
    }`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-4xl leading-none">🛋️</span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-emerald-700">Zeh M'zeh</span>
            <span dir="rtl" className="text-xs text-emerald-600 font-medium tracking-wide">זה מזה</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/giveaways" className="text-gray-600 hover:text-emerald-700 transition-colors">Giveaways</Link>
          <Link href="/sales" className="text-gray-600 hover:text-emerald-700 transition-colors">For Sale</Link>
          <Link href="/manage" className="text-gray-600 hover:text-emerald-700 transition-colors">Manage Listing</Link>
          <Link href="/about" className="text-gray-600 hover:text-emerald-700 transition-colors">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-emerald-700 transition-colors">Contact</Link>
          <Link
            href="/post"
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            Post a Listing
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/giveaways" onClick={() => setOpen(false)} className="text-gray-700 py-1">Giveaways</Link>
          <Link href="/sales" onClick={() => setOpen(false)} className="text-gray-700 py-1">For Sale</Link>
          <Link href="/manage" onClick={() => setOpen(false)} className="text-gray-700 py-1">Manage Listing</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-gray-700 py-1">About</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-gray-700 py-1">Contact</Link>
          <Link
            href="/post"
            onClick={() => setOpen(false)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-center"
          >
            Post a Listing
          </Link>
        </div>
      )}
    </nav>
  )
}

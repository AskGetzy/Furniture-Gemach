'use client'
import { useState } from 'react'
import { Phone, Mail } from 'lucide-react'

export default function ContactReveal({ phone, email }: { phone: string; email: string }) {
  const [revealPhone, setRevealPhone] = useState(false)
  const [revealEmail, setRevealEmail] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setRevealPhone(!revealPhone)}
        className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-emerald-400 transition-colors w-fit"
      >
        <Phone size={15} className="text-emerald-600" />
        {revealPhone ? phone : 'Show phone number'}
      </button>
      <button
        onClick={() => setRevealEmail(!revealEmail)}
        className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-emerald-400 transition-colors w-fit"
      >
        <Mail size={15} className="text-emerald-600" />
        {revealEmail ? email : 'Show email address'}
      </button>
    </div>
  )
}

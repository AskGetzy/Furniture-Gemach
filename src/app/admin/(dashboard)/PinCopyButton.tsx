'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function PinCopyButton({ pin }: { pin: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(pin)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 group"
      title="Copy PIN"
    >
      <span className="font-mono text-xs tracking-widest text-yellow-300">{pin}</span>
      {copied
        ? <Check size={11} className="text-emerald-400" />
        : <Copy size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      }
    </button>
  )
}

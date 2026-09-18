'use client'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setError('All fields required'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) setDone(true)
    else setError('Failed to send. Please try again.')
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="mx-auto mb-3 text-emerald-500" size={40} />
        <h2 className="font-bold text-gray-900 text-lg mb-1">Message sent!</h2>
        <p className="text-gray-500 text-sm">We'll get back to you as soon as we can.</p>
      </div>
    )
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          autoComplete="name"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="How can we help?"
          rows={5}
          className={`${inputCls} resize-none`}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-base hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Sending…' : 'Send message'}
      </button>
      <p className="text-xs text-center text-gray-400">
        This message is sent directly to the Zeh M'zeh team from our platform.
      </p>
    </form>
  )
}

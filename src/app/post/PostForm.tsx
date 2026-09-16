'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, X, AlertCircle, ChevronRight } from 'lucide-react'
import { AREAS, CATEGORIES } from '@/lib/supabase/types'
import type { ListingArea, ListingCategory, ListingType } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id: string) => void
    }
  }
}

interface FormData {
  type: ListingType
  area: ListingArea | ''
  categories: ListingCategory[]
  title: string
  description: string
  price: string
  poster_name: string
  poster_email: string
  poster_phone: string
  poster_address: string
}

const INITIAL: FormData = {
  type: 'giveaway',
  area: '',
  categories: [],
  title: '',
  description: '',
  price: '',
  poster_name: '',
  poster_email: '',
  poster_phone: '',
  poster_address: '',
}

interface Props {
  giveawayFee: number
  saleFee: number
}

export default function PostForm({ giveawayFee, saleFee }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'photos', string>>>({})
  const [step, setStep] = useState<'form' | 'submitting' | 'error'>('form')
  const [submitError, setSubmitError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileIdRef = useRef<string | null>(null)
  const turnstileTokenRef = useRef<string>('')
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        turnstileIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token: string) => { turnstileTokenRef.current = token },
          'expired-callback': () => { turnstileTokenRef.current = '' },
        })
      }
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [siteKey])

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function toggleCategory(cat: ListingCategory) {
    setForm(f => {
      const has = f.categories.includes(cat)
      const next = has ? f.categories.filter(c => c !== cat) : [...f.categories, cat]
      return { ...f, categories: next }
    })
    setErrors(e => ({ ...e, categories: '' }))
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const newPhotos = [...photos, ...files].slice(0, 6)
    setPhotos(newPhotos)
    const newPreviews = newPhotos.map(f => URL.createObjectURL(f))
    setPreviews(newPreviews)
    setErrors(err => ({ ...err, photos: '' }))
  }

  function removePhoto(i: number) {
    const p = photos.filter((_, idx) => idx !== i)
    const pr = previews.filter((_, idx) => idx !== i)
    setPhotos(p)
    setPreviews(pr)
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (photos.length < 2) errs.photos = 'Please upload at least 2 photos'
    if (!form.area) errs.area = 'Required'
    if (form.categories.length === 0) errs.categories = 'Select at least one category'
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.description.trim()) errs.description = 'Required'
    if (form.type === 'sale') {
      const p = parseFloat(form.price)
      if (!form.price || isNaN(p) || p <= 0) errs.price = 'Enter a valid price'
    }
    if (!form.poster_name.trim()) errs.poster_name = 'Required'
    if (!form.poster_email.trim() || !form.poster_email.includes('@')) errs.poster_email = 'Valid email required'
    if (!form.poster_phone.trim()) errs.poster_phone = 'Required'
    if (!form.poster_address.trim()) errs.poster_address = 'Required (kept private)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStep('submitting')

    try {
      const supabase = createClient()

      // Upload photos
      const photoUrls: string[] = []
      for (const photo of photos) {
        const ext = photo.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(path, photo, { contentType: photo.type })
        if (uploadError) throw new Error('Photo upload failed: ' + uploadError.message)
        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(path)
        photoUrls.push(publicUrl)
      }

      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.type === 'sale' ? parseFloat(form.price) : null,
          photo_urls: photoUrls,
          turnstile_token: turnstileTokenRef.current || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')

      if (data.free) {
        router.push(`/post/success?listing_id=${data.listingId}&free=1`)
      } else {
        window.location.href = data.checkoutUrl
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStep('error')
      if (siteKey && window.turnstile && turnstileIdRef.current) {
        window.turnstile.reset(turnstileIdRef.current)
        turnstileTokenRef.current = ''
      }
    }
  }

  const currentFee = form.type === 'giveaway' ? giveawayFee : saleFee
  const feeText = currentFee === 0 ? 'Free to post' : `Listing fee: $${(currentFee / 100).toFixed(0)}`

  const inputCls = (field: keyof FormData) =>
    `w-full rounded-xl border text-base px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`

  if (step === 'submitting') {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4 animate-bounce">📸</div>
        <p className="font-semibold text-gray-800">Uploading photos and creating your listing…</p>
        <p className="text-gray-500 text-sm mt-2">
          {currentFee === 0 ? 'Almost done!' : "You'll be redirected to payment in a moment."}
        </p>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
        <p className="font-semibold text-red-800 mb-1">Something went wrong</p>
        <p className="text-red-700 text-sm mb-4">{submitError}</p>
        <button onClick={() => setStep('form')} className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-600">
          Try again
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Type selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="font-semibold text-gray-800 mb-3">Listing type</p>
        <div className="grid grid-cols-2 gap-3">
          {(['giveaway', 'sale'] as ListingType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => set('type', t)}
              className={`rounded-xl py-3.5 text-sm font-semibold border-2 transition-all ${
                form.type === t
                  ? t === 'giveaway'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {t === 'giveaway' ? '🎁 Giveaway (Free)' : '🏷️ For Sale'}
            </button>
          ))}
        </div>
        <div className={`mt-3 text-xs rounded-lg p-2.5 ${form.type === 'giveaway' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
          {form.type === 'giveaway'
            ? `${feeText} · Item is free for the recipient`
            : `${feeText} · You set the asking price`}
        </div>
      </div>

      {/* Photos — mobile-first camera capture */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <p className="font-semibold text-gray-800 mb-1">Photos <span className="text-red-500">*</span></p>
        <p className="text-xs text-gray-500 mb-3">Add at least 2 photos. Tap the camera button to take new ones or choose from your gallery.</p>

        {errors.photos && (
          <p className="text-red-600 text-sm mb-2 flex items-center gap-1"><AlertCircle size={14} />{errors.photos}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={src} alt="" fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {photos.length < 6 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors active:scale-95"
            >
              <Camera size={24} className="mb-1" />
              <span className="text-xs">{photos.length === 0 ? 'Add photo' : 'Add more'}</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
          onChange={handlePhotos}
        />
        <p className="text-xs text-gray-400">{photos.length}/6 photos added</p>
      </div>

      {/* Item details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
        <p className="font-semibold text-gray-800">Item details</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Dark wood dining table with 6 chairs"
            className={inputCls('title')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Area <span className="text-red-500">*</span>
          </label>
          <select
            value={form.area}
            onChange={e => set('area', e.target.value)}
            className={inputCls('area')}
          >
            <option value="">Select area</option>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
            <span className="ml-1 text-xs font-normal text-gray-400">(select all that apply)</span>
          </label>
          <div className={`rounded-xl border p-3 flex flex-wrap gap-2 ${errors.categories ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}>
            {CATEGORIES.map(c => {
              const selected = form.categories.includes(c.value)
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleCategory(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selected
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
        </div>

        {form.type === 'sale' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Asking price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="0.00"
              min="1"
              step="1"
              className={inputCls('price')}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe the condition, dimensions, color, etc."
            rows={4}
            className={`${inputCls('description')} resize-none`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
        <div>
          <p className="font-semibold text-gray-800">Your contact info</p>
          <p className="text-xs text-gray-500 mt-0.5">Phone and email are shown to interested buyers (click to reveal). Your address is never shown publicly.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.poster_name}
            onChange={e => set('poster_name', e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className={inputCls('poster_name')}
          />
          {errors.poster_name && <p className="text-red-500 text-xs mt-1">{errors.poster_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={form.poster_phone}
            onChange={e => set('poster_phone', e.target.value)}
            placeholder="(555) 000-0000"
            autoComplete="tel"
            inputMode="tel"
            className={inputCls('poster_phone')}
          />
          {errors.poster_phone && <p className="text-red-500 text-xs mt-1">{errors.poster_phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={form.poster_email}
            onChange={e => set('poster_email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            className={inputCls('poster_email')}
          />
          {errors.poster_email && <p className="text-red-500 text-xs mt-1">{errors.poster_email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your address <span className="text-red-500">*</span>
            <span className="ml-1 text-xs font-normal text-gray-400">(private — never shown publicly)</span>
          </label>
          <input
            type="text"
            value={form.poster_address}
            onChange={e => set('poster_address', e.target.value)}
            placeholder="123 Main St, Monsey, NY 10952"
            autoComplete="street-address"
            className={inputCls('poster_address')}
          />
          {errors.poster_address && <p className="text-red-500 text-xs mt-1">{errors.poster_address}</p>}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Important reminder</p>
        <p>Please take your listing down once the item is no longer available. You can do this using your PIN code, which will be emailed to you.</p>
      </div>

      {/* Turnstile */}
      {siteKey && <div ref={turnstileRef} className="flex justify-center" />}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-emerald-600 text-white font-semibold text-base py-4 rounded-2xl hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
      >
        {currentFee === 0 ? 'Post Listing' : 'Continue to Payment'}
        <ChevronRight size={20} />
      </button>

      <p className="text-center text-xs text-gray-400">
        {feeText} · Listing active for 30 days
        {currentFee > 0 && ' · Secure payment via Stripe'}
      </p>
    </form>
  )
}

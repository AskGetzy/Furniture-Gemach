'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Camera, Gift, Tag, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AREAS, CATEGORIES } from '@/lib/supabase/types'
import type { ListingArea, ListingCategory, ListingType } from '@/lib/supabase/types'

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
  type: 'giveaway', area: '', categories: [],
  title: '', description: '', price: '',
  poster_name: '', poster_email: '', poster_phone: '', poster_address: '',
}

export default function AdminPostModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'photos', string>>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function close() { setOpen(false); setForm(INITIAL); setPhotos([]); setPreviews([]); setErrors({}); setSaveError('') }

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function toggleCategory(cat: ListingCategory) {
    setForm(f => {
      const has = f.categories.includes(cat)
      return { ...f, categories: has ? f.categories.filter(c => c !== cat) : [...f.categories, cat] }
    })
    setErrors(e => ({ ...e, categories: '' }))
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const next = [...photos, ...files].slice(0, 6)
    setPhotos(next)
    setPreviews(next.map(f => URL.createObjectURL(f)))
    setErrors(err => ({ ...err, photos: '' }))
  }

  function removePhoto(i: number) {
    setPhotos(p => p.filter((_, idx) => idx !== i))
    setPreviews(p => p.filter((_, idx) => idx !== i))
  }

  function validate() {
    const errs: typeof errors = {}
    if (photos.length < 2) errs.photos = 'At least 2 photos required'
    if (!form.area) errs.area = 'Required'
    if (!form.categories.length) errs.categories = 'Select at least one'
    if (!form.title.trim()) errs.title = 'Required'
    if (!form.description.trim()) errs.description = 'Required'
    if (form.type === 'sale') {
      const p = parseFloat(form.price)
      if (!form.price || isNaN(p) || p <= 0) errs.price = 'Enter a valid price'
    }
    if (!form.poster_name.trim()) errs.poster_name = 'Required'
    if (!form.poster_email.includes('@')) errs.poster_email = 'Valid email required'
    if (!form.poster_phone.trim()) errs.poster_phone = 'Required'
    if (!form.poster_address.trim()) errs.poster_address = 'Required'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSaveError('')

    try {
      const supabase = createClient()
      const photoUrls: string[] = []
      for (const photo of photos) {
        const ext = photo.name.split('.').pop()
        const path = `admin-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('listing-photos').upload(path, photo, { contentType: photo.type })
        if (uploadErr) throw new Error('Photo upload failed: ' + uploadErr.message)
        photoUrls.push(supabase.storage.from('listing-photos').getPublicUrl(path).data.publicUrl)
      }

      const res = await fetch('/api/admin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.type === 'sale' ? parseFloat(form.price) : null,
          photo_urls: photoUrls,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create listing')

      close()
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inp = (field: keyof FormData) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${errors[field] ? 'border-red-500' : 'border-gray-700'}`

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        + Post as Admin
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-white font-bold">Post as Admin</h2>
              <button onClick={close} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {/* Type */}
              <div className="grid grid-cols-2 gap-2">
                {(['giveaway', 'sale'] as ListingType[]).map(t => (
                  <button key={t} type="button" onClick={() => set('type', t)}
                    className={`py-2.5 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 ${form.type === t ? t === 'giveaway' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                    {t === 'giveaway' ? <><Gift size={14} />Giveaway</> : <><Tag size={14} />For Sale</>}
                  </button>
                ))}
              </div>

              {/* Photos */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Photos <span className="text-red-400">*</span> <span className="text-gray-500 font-normal">(min 2)</span></p>
                {errors.photos && <p className="text-red-400 text-xs mb-1">{errors.photos}</p>}
                <div className="grid grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                      <button type="button" onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                      <Camera size={18} /><span className="text-xs mt-0.5">Add</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Dining table" className={inp('title')} />
                  {errors.title && <p className="text-red-400 text-xs mt-0.5">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Area <span className="text-red-400">*</span></label>
                    <select value={form.area} onChange={e => set('area', e.target.value)} className={inp('area')}>
                      <option value="">Select…</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {errors.area && <p className="text-red-400 text-xs mt-0.5">{errors.area}</p>}
                  </div>
                  {form.type === 'sale' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Price ($) <span className="text-red-400">*</span></label>
                      <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" min="1" className={inp('price')} />
                      {errors.price && <p className="text-red-400 text-xs mt-0.5">{errors.price}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Categories <span className="text-red-400">*</span></label>
                  <div className={`rounded-lg border p-2 flex flex-wrap gap-1.5 ${errors.categories ? 'border-red-500' : 'border-gray-700'}`}>
                    {CATEGORIES.map(c => {
                      const sel = form.categories.includes(c.value)
                      return (
                        <button key={c.value} type="button" onClick={() => toggleCategory(c.value)}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition-all ${sel ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                  {errors.categories && <p className="text-red-400 text-xs mt-0.5">{errors.categories}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description <span className="text-red-400">*</span></label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="Condition, dimensions, color…" rows={3} className={`${inp('description')} resize-none`} />
                  {errors.description && <p className="text-red-400 text-xs mt-0.5">{errors.description}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-gray-800 pt-4 flex flex-col gap-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Poster contact info</p>
                {(['poster_name', 'poster_email', 'poster_phone', 'poster_address'] as const).map(field => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">{field.replace('poster_', '').replace('_', ' ')} <span className="text-red-400">*</span></label>
                    <input type={field === 'poster_email' ? 'email' : field === 'poster_phone' ? 'tel' : 'text'}
                      value={form[field]} onChange={e => set(field, e.target.value)}
                      className={inp(field)} />
                    {errors[field] && <p className="text-red-400 text-xs mt-0.5">{errors[field]}</p>}
                  </div>
                ))}
              </div>

              {saveError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
                  <AlertCircle size={14} />{saveError}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={close} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Posting…' : 'Post Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

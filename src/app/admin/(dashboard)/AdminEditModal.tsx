'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Camera, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AREAS, CATEGORIES } from '@/lib/supabase/types'
import type { Listing, ListingArea, ListingCategory, ListingType } from '@/lib/supabase/types'

interface Props {
  listing: Listing
}

export default function AdminEditModal({ listing }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ListingType>(listing.type)
  const [area, setArea] = useState<ListingArea | ''>(listing.area)
  const [categories, setCategories] = useState<ListingCategory[]>(listing.categories ?? [listing.category])
  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [price, setPrice] = useState(listing.price != null ? String(listing.price) : '')
  const [posterName, setPosterName] = useState(listing.poster_name)
  const [posterEmail, setPosterEmail] = useState(listing.poster_email)
  const [posterPhone, setPosterPhone] = useState(listing.poster_phone)
  const [posterAddress, setPosterAddress] = useState(listing.poster_address)

  // Existing photo URLs (may be removed). New files to upload.
  const [existingUrls, setExistingUrls] = useState<string[]>(listing.photo_urls ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const totalPhotos = existingUrls.length + newFiles.length
  const MIN_PHOTOS = 2

  function close() {
    setOpen(false)
    // Reset to listing values
    setType(listing.type); setArea(listing.area)
    setCategories(listing.categories ?? [listing.category])
    setTitle(listing.title); setDescription(listing.description)
    setPrice(listing.price != null ? String(listing.price) : '')
    setPosterName(listing.poster_name); setPosterEmail(listing.poster_email)
    setPosterPhone(listing.poster_phone); setPosterAddress(listing.poster_address)
    setExistingUrls(listing.photo_urls ?? [])
    setNewFiles([]); setNewPreviews([])
    setErrors({}); setSaveError('')
  }

  function removeExistingPhoto(url: string) {
    if (totalPhotos <= MIN_PHOTOS) {
      setErrors(e => ({ ...e, photos: `Must keep at least ${MIN_PHOTOS} photos. Upload a replacement first.` }))
      return
    }
    setExistingUrls(u => u.filter(x => x !== url))
    setErrors(e => ({ ...e, photos: '' }))
  }

  function removeNewPhoto(i: number) {
    if (totalPhotos <= MIN_PHOTOS) {
      setErrors(e => ({ ...e, photos: `Must keep at least ${MIN_PHOTOS} photos.` }))
      return
    }
    setNewFiles(f => f.filter((_, idx) => idx !== i))
    setNewPreviews(p => p.filter((_, idx) => idx !== i))
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const combined = [...newFiles, ...files].slice(0, Math.max(0, 6 - existingUrls.length))
    setNewFiles(combined)
    setNewPreviews(combined.map(f => URL.createObjectURL(f)))
    setErrors(err => ({ ...err, photos: '' }))
  }

  function toggleCategory(cat: ListingCategory) {
    setCategories(c => c.includes(cat) ? c.filter(x => x !== cat) : [...c, cat])
    setErrors(e => ({ ...e, categories: '' }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (totalPhotos < MIN_PHOTOS) errs.photos = `At least ${MIN_PHOTOS} photos required`
    if (!area) errs.area = 'Required'
    if (!categories.length) errs.categories = 'Select at least one'
    if (!title.trim()) errs.title = 'Required'
    if (!description.trim()) errs.description = 'Required'
    if (type === 'sale') {
      const p = parseFloat(price)
      if (!price || isNaN(p) || p <= 0) errs.price = 'Enter a valid price'
    }
    if (!posterName.trim()) errs.poster_name = 'Required'
    if (!posterEmail.includes('@')) errs.poster_email = 'Valid email required'
    if (!posterPhone.trim()) errs.poster_phone = 'Required'
    if (!posterAddress.trim()) errs.poster_address = 'Required'
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

      // Upload any new photos
      const uploadedUrls: string[] = []
      for (const file of newFiles) {
        const ext = file.name.split('.').pop()
        const path = `admin-edit-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('listing-photos').upload(path, file, { contentType: file.type })
        if (uploadErr) throw new Error('Photo upload failed: ' + uploadErr.message)
        uploadedUrls.push(supabase.storage.from('listing-photos').getPublicUrl(path).data.publicUrl)
      }

      const finalUrls = [...existingUrls, ...uploadedUrls]

      const res = await fetch('/api/admin/edit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          type, area, categories,
          title, description,
          price: type === 'sale' ? parseFloat(price) : null,
          photo_urls: finalUrls,
          poster_name: posterName,
          poster_email: posterEmail,
          poster_phone: posterPhone,
          poster_address: posterAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      close()
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inp = (err?: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${err ? 'border-red-500' : 'border-gray-700'}`

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-white font-bold">Edit Listing</h2>
                <p className="text-gray-500 text-xs mt-0.5 truncate max-w-xs">{listing.title}</p>
              </div>
              <button onClick={close} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {/* Type */}
              <div className="grid grid-cols-2 gap-2">
                {(['giveaway', 'sale'] as ListingType[]).map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-all ${type === t ? t === 'giveaway' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                    {t === 'giveaway' ? 'Giveaway' : 'For Sale'}
                  </button>
                ))}
              </div>

              {/* Photos */}
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">
                  Photos <span className="text-gray-500 font-normal text-xs">({totalPhotos}/6 · min {MIN_PHOTOS})</span>
                </p>
                {errors.photos && <p className="text-red-400 text-xs mb-1 flex items-center gap-1"><AlertCircle size={12} />{errors.photos}</p>}
                <div className="grid grid-cols-4 gap-2">
                  {/* Existing photos */}
                  {existingUrls.map((url, i) => (
                    <div key={`ex-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <Image src={url} alt="" fill className="object-cover" sizes="100px" unoptimized />
                      <button type="button" onClick={() => removeExistingPhoto(url)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {/* New photo previews */}
                  {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 ring-1 ring-emerald-500">
                      <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                      <button type="button" onClick={() => removeNewPhoto(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {/* Add button */}
                  {totalPhotos < 6 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                      <Camera size={16} /><span className="text-xs mt-0.5">Add</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                <p className="text-xs text-gray-600 mt-1">New photos (green ring) will be uploaded on save.</p>
              </div>

              {/* Core fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={title} onChange={e => { setTitle(e.target.value); setErrors(err => ({...err, title: ''})) }} className={inp(errors.title)} />
                  {errors.title && <p className="text-red-400 text-xs mt-0.5">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Area <span className="text-red-400">*</span></label>
                    <select value={area} onChange={e => { setArea(e.target.value as ListingArea); setErrors(err => ({...err, area: ''})) }} className={inp(errors.area)}>
                      <option value="">Select…</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {errors.area && <p className="text-red-400 text-xs mt-0.5">{errors.area}</p>}
                  </div>
                  {type === 'sale' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Price ($) <span className="text-red-400">*</span></label>
                      <input type="number" value={price} onChange={e => { setPrice(e.target.value); setErrors(err => ({...err, price: ''})) }} min="1" className={inp(errors.price)} />
                      {errors.price && <p className="text-red-400 text-xs mt-0.5">{errors.price}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Categories <span className="text-red-400">*</span></label>
                  <div className={`rounded-lg border p-2 flex flex-wrap gap-1.5 ${errors.categories ? 'border-red-500' : 'border-gray-700'}`}>
                    {CATEGORIES.map(c => {
                      const sel = categories.includes(c.value)
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
                  <textarea value={description} onChange={e => { setDescription(e.target.value); setErrors(err => ({...err, description: ''})) }}
                    rows={3} className={`${inp(errors.description)} resize-none`} />
                  {errors.description && <p className="text-red-400 text-xs mt-0.5">{errors.description}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-gray-800 pt-3 flex flex-col gap-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Contact info</p>
                {([
                  ['poster_name', 'Name', posterName, setPosterName, 'text'],
                  ['poster_email', 'Email', posterEmail, setPosterEmail, 'email'],
                  ['poster_phone', 'Phone', posterPhone, setPosterPhone, 'tel'],
                  ['poster_address', 'Address (private)', posterAddress, setPosterAddress, 'text'],
                ] as const).map(([field, label, val, setter, inputType]) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1">{label} <span className="text-red-400">*</span></label>
                    <input type={inputType} value={val}
                      onChange={e => { setter(e.target.value as never); setErrors(err => ({...err, [field]: ''})) }}
                      className={inp(errors[field])} />
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
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

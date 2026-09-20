export type ListingType = 'giveaway' | 'sale'
export type ListingArea = 'Monsey' | 'Monroe' | 'Brooklyn' | 'Lakewood'
export type ListingCategory = 'dining_room' | 'kitchen' | 'bedroom' | 'sofas' | 'other'
export type ListingStatus = 'pending_payment' | 'active' | 'expired' | 'archived' | 'removed' | 'taken'

export interface Listing {
  id: string
  type: ListingType
  area: ListingArea
  category: ListingCategory  // legacy, kept for DB compat
  categories: ListingCategory[]
  title: string
  description: string
  price: number | null
  photo_urls: string[]
  poster_name: string
  poster_email: string
  poster_phone: string
  poster_address: string
  pin_code: string
  status: ListingStatus
  posted_at: string | null
  expires_at: string | null
  payment_id: string | null
  views: number
  created_at: string
  updated_at: string
}

export interface Flag {
  id: string
  listing_id: string
  reason: string
  created_at: string
  resolved: boolean
  resolved_at: string | null
}

export interface Payment {
  id: string
  listing_id: string
  stripe_payment_intent_id: string
  amount: number
  type: 'listing_fee' | 'renewal_fee'
  status: string
  refunded: boolean
  refunded_at: string | null
  stripe_refund_id: string | null
  created_at: string
}

// Supabase Database type — use Record<string, unknown> overrides for any so the
// client doesn't narrow to never on Insert/Update
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any

export const AREAS: ListingArea[] = ['Monsey', 'Monroe', 'Brooklyn', 'Lakewood']
export const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'sofas', label: 'Sofas & Couches' },
  { value: 'other', label: 'Other' },
]
export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  dining_room: 'Dining Room',
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  sofas: 'Sofas & Couches',
  other: 'Other',
}

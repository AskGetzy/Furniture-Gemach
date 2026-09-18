import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdminSession } from '@/lib/admin-auth'
import { generatePinCode } from '@/lib/utils'

export async function POST(req: Request) {
  if (!await checkAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    type, area, categories, title, description, price,
    photo_urls, poster_name, poster_email, poster_phone, poster_address,
  } = body

  if (!type || !area || !categories?.length || !title || !description ||
      !poster_name || !poster_email || !poster_phone || !poster_address) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!photo_urls || photo_urls.length < 2) {
    return NextResponse.json({ error: 'At least 2 photos required' }, { status: 400 })
  }
  if (type === 'sale' && (!price || price <= 0)) {
    return NextResponse.json({ error: 'Price required for sale listings' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const pinCode = generatePinCode()

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      type, area, categories,
      category: categories[0],
      title, description,
      price: type === 'sale' ? price : null,
      photo_urls,
      poster_name, poster_email, poster_phone, poster_address,
      pin_code: pinCode,
      status: 'active',
      posted_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error || !listing) {
    return NextResponse.json({ error: error?.message || 'Failed to create listing' }, { status: 500 })
  }

  return NextResponse.json({ listingId: listing.id })
}

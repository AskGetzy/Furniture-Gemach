import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdminSession } from '@/lib/admin-auth'

export async function POST(req: Request) {
  if (!await checkAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { listing_id, ...fields } = body

  if (!listing_id) {
    return NextResponse.json({ error: 'listing_id required' }, { status: 400 })
  }
  if (fields.photo_urls !== undefined && fields.photo_urls.length < 2) {
    return NextResponse.json({ error: 'At least 2 photos required' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  const allowed = ['type', 'area', 'categories', 'title', 'description', 'price',
                   'photo_urls', 'poster_name', 'poster_email', 'poster_phone', 'poster_address']
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key]
  }
  if (update.categories) {
    update.category = (update.categories as string[])[0]
  }

  const supabase = await createServiceClient()
  const { error } = await supabase.from('listings').update(update).eq('id', listing_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

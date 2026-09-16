import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendAvailabilityCheck } from '@/lib/email'

// Runs daily; sends availability check emails at 7, 14, and 21 days after posting
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date()

  // Check at 7, 14, 21 days (±12 hours window)
  const checkDays = [7, 14, 21]
  let sent = 0

  for (const days of checkDays) {
    const windowStart = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000))
    const windowEnd = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000))

    const { data: listings } = await supabase
      .from('listings')
      .select('id, title, poster_name, poster_email, pin_code, posted_at')
      .eq('status', 'active')
      .gte('posted_at', windowStart.toISOString())
      .lte('posted_at', windowEnd.toISOString())

    for (const listing of listings || []) {
      try {
        await sendAvailabilityCheck({
          to: listing.poster_email,
          posterName: listing.poster_name,
          listingTitle: listing.title,
          listingId: listing.id,
          pinCode: listing.pin_code,
        })
        sent++
      } catch (err) {
        console.error(`Availability check email failed for listing ${listing.id}:`, err)
      }
    }
  }

  return NextResponse.json({ sent })
}

import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  try {
    await sendContactEmail({ name, email, message })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

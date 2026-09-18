// Admin login is now handled client-side via Supabase Auth signInWithPassword.
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Gone' }, { status: 410 })
}

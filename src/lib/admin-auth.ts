import { createClient } from '@/lib/supabase/server'

const ADMIN_UID = 'a7c4c3aa-c10c-4d52-a12f-11bc3656701a'

/**
 * Server-side admin check. Uses auth.getUser() which validates the JWT
 * against Supabase servers — cannot be spoofed by a tampered local cookie.
 * Returns true only for the single designated admin UID.
 */
export async function checkAdminSession(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false
    return user.id === ADMIN_UID
  } catch {
    return false
  }
}

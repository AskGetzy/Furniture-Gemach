import { createClient } from '@/lib/supabase/server'

const ADMIN_UID = 'ede03dd5-cc7c-4006-9d59-363f2409d9b3'

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

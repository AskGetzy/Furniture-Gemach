import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_UID = 'c48c5389-ac26-4ed8-81b5-db2c3b011558'

export async function proxy(request: NextRequest) {
  // /admin/login must be reachable without a session — skip auth check for it.
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next({ request })
  }

  // Build a mutable response so Supabase can write refreshed session cookies.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT server-side and refreshes the session if needed.
  const { data: { user } } = await supabase.auth.getUser()

  // Block anyone who isn't the designated admin UID.
  if (user?.id !== ADMIN_UID) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}

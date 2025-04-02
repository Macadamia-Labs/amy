import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createUserProfile, getUserProfile } from './lib/queries/server'

export async function middleware(request: NextRequest) {
  try {
    console.log('updateSession', request.nextUrl.pathname)
    let supabaseResponse = NextResponse.next({
      request
    })

    // Bypass middleware for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      return supabaseResponse
    }

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
            supabaseResponse = NextResponse.next({
              request
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          }
        }
      }
    )

    const {
      data: { user }
    } = await supabase.auth.getUser()

    // Redirect authenticated users away from login page
    if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      console.log('redirecting to login, pathname:', request.nextUrl.pathname)
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Check user approval status if logged in
    if (
      user &&
      !request.nextUrl.pathname.startsWith('/waitlist') &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      const profile = await getUserProfile(user.id)

      console.log('profile', profile)
      console.log('is_approved', profile?.is_approved)

      if (!profile) {
        await createUserProfile(user.id)
        console.log(
          'redirecting to waitlists, pathname:',
          request.nextUrl.pathname
        )
        const url = request.nextUrl.clone()
        url.pathname = '/waitlist'
        return NextResponse.redirect(url)
      }

      if (!profile.is_approved) {
        console.log(
          'redirecting to waitlists, pathname:',
          request.nextUrl.pathname
        )
        const url = request.nextUrl.clone()
        url.pathname = '/waitlist'
        return NextResponse.redirect(url)
      }
    }

    // Redirect /cooper to /cooper/chat
    if (request.nextUrl.pathname === '/cooper') {
      const url = request.nextUrl.clone()
      url.pathname = '/cooper/chat'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // Redirect to an error page or continue to the requested page
    // depending on your error handling strategy
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static files
     * - image optimization files
     * - favicon and other asset files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
}

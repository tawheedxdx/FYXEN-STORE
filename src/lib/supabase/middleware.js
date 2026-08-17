import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const host = rawHost.split(':')[0].toLowerCase()
  const url = request.nextUrl.clone()
  const isProd = process.env.NODE_ENV === 'production' && !host.includes('localhost')

  // Identify valid subdomains & domains
  const isAdminSubdomain = host === 'admin.fyxen.in' || host === 'admin.localhost'
  const isCheckoutSubdomain = host === 'securecheckout.fyxen.in' || host === 'securecheckout.localhost'
  const isMainStoreDomain = host === 'fyxen.in' || host === 'www.fyxen.in' || host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app')

  let rewriteUrl = null

  // Check for unknown or typo subdomains (e.g. seccurecheckout.fyxen.in, app.fyxen.in, etc.)
  const isFyxenDomain = host.endsWith('fyxen.in')
  const isLocalhost = host.endsWith('localhost')

  if ((isFyxenDomain || isLocalhost) && !isAdminSubdomain && !isCheckoutSubdomain && !isMainStoreDomain) {
    url.pathname = '/_not-found'
    return NextResponse.rewrite(url, { status: 404 })
  }

  if (isAdminSubdomain) {
    // If accessed via admin subdomain and path does not start with /admin, rewrite internally
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
      rewriteUrl = url
    }
  } else if (isCheckoutSubdomain) {
    // If accessed via secure checkout subdomain:
    if (url.pathname === '/' || url.pathname === '/checkout') {
      url.pathname = '/checkout'
      rewriteUrl = url
    } else if (url.pathname.startsWith('/order/')) {
      // Allow /order/success and /order/failed directly
      rewriteUrl = url
    } else if (url.pathname.startsWith('/api/')) {
      // Allow API routes
      rewriteUrl = url
    } else {
      // If user navigates away from checkout on securecheckout subdomain, redirect to main storefront
      if (isProd) {
        return NextResponse.redirect(new URL(url.pathname + url.search, 'https://www.fyxen.in'))
      }
    }
  } else {
    // If accessed via main domain (e.g. fyxen.in/admin), redirect to admin.fyxen.in in production
    if (url.pathname.startsWith('/admin') && isProd) {
      const cleanPath = url.pathname.replace(/^\/admin/, '') || '/'
      return NextResponse.redirect(new URL(cleanPath + url.search, 'https://admin.fyxen.in'))
    }
    // If accessed via main domain fyxen.in/checkout, redirect to securecheckout.fyxen.in in production
    if (url.pathname === '/checkout' && isProd) {
      return NextResponse.redirect(new URL('/' + url.search, 'https://securecheckout.fyxen.in'))
    }
  }


  let supabaseResponse = rewriteUrl
    ? NextResponse.rewrite(rewriteUrl, { request })
    : NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: {
        domain: isProd ? '.fyxen.in' : undefined,
        path: '/',
        sameSite: 'lax',
        secure: isProd,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              domain: isProd ? '.fyxen.in' : options?.domain,
            }
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection for admin panel
  const isAccessingAdmin = isAdminSubdomain || url.pathname.startsWith('/admin')
  if (isAccessingAdmin) {
    if (!user) {
      if (isAdminSubdomain && isProd) {
        return NextResponse.redirect(new URL('https://www.fyxen.in/login?redirect=https://admin.fyxen.in'))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Route protection for checkout
  const isAccessingCheckout = isCheckoutSubdomain || url.pathname === '/checkout'
  if (isAccessingCheckout) {
    if (!user) {
      if (isProd) {
        return NextResponse.redirect(new URL('https://www.fyxen.in/login?redirect=https://securecheckout.fyxen.in'))
      }
      return NextResponse.redirect(new URL('/login?redirect=/checkout', request.url))
    }
  }

  return supabaseResponse
}



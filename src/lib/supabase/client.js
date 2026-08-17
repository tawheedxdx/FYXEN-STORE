import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isProd = typeof window !== 'undefined' && window.location.hostname.endsWith('fyxen.in');

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: {
        domain: isProd ? '.fyxen.in' : undefined,
        path: '/',
        sameSite: 'lax',
        secure: isProd,
      },
    }
  )
}


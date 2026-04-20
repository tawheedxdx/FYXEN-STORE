'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  const isMissingEnv = error?.message?.includes('Missing Supabase');

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {isMissingEnv ? 'Server Configuration Error' : 'Something went wrong'}
        </h1>
        <p style={{ color: '#71717a', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
          {isMissingEnv
            ? 'The server is missing required environment variables. If you are the site owner, please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel project settings.'
            : 'An unexpected error occurred. Please try reloading the page.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ background: '#fff', color: '#09090b', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

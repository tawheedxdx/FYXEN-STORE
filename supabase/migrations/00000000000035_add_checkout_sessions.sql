-- Migration: 00000000000035_add_checkout_sessions.sql
-- Description: Create checkout_sessions table for 5-minute temporary checkout tokens and anti-bot/direct access prevention

CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_snapshot JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for high-performance session lookup and expiry checks
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_token_lookup 
  ON public.checkout_sessions(session_token, expires_at, is_used);

CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user 
  ON public.checkout_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- RLS: Authenticated users can insert their own checkout sessions
CREATE POLICY "Users can create their checkout sessions" 
  ON public.checkout_sessions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can view their own checkout sessions
CREATE POLICY "Users can read their own checkout sessions" 
  ON public.checkout_sessions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS: Service role has full management access
CREATE POLICY "Service role full access on checkout_sessions" 
  ON public.checkout_sessions 
  FOR ALL 
  TO service_role 
  USING (true);

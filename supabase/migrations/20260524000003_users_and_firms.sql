-- ============================================================
-- LexFlow: Multi-tenant firms + users tables
-- Run this in Supabase → SQL Editor → Run
-- ============================================================

-- FIRMS TABLE (tenants)
CREATE TABLE IF NOT EXISTS public.firms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  logo_url text,
  primary_color text NOT NULL DEFAULT '#c9a84c',
  website text,
  plan text NOT NULL DEFAULT 'starter',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id uuid REFERENCES public.firms(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'associate_solicitor',
  active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_firm_id_idx ON public.users(firm_id);
CREATE INDEX IF NOT EXISTS firms_active_idx ON public.firms(active);

-- Add firm_id to all tenant tables
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.firm_settings ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.email_settings ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.checklist_templates ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.quote_templates ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS firm_id uuid REFERENCES public.firms(id);

-- Insert LexFlow platform firm
INSERT INTO public.firms (id, name, email, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'LexFlow Platform', 'baturay@lexflow.co.uk', 'platform')
ON CONFLICT DO NOTHING;

-- Insert super admin user (password will be set via env, hash is for 'LexFlow2026!')
-- bcrypt hash of 'LexFlow2026!'
INSERT INTO public.users (id, firm_id, name, email, password_hash, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Baturay Ozden',
  'baturay@lexflow.co.uk',
  '$2b$10$placeholder_will_be_set_by_seed',
  'platform_admin'
)
ON CONFLICT DO NOTHING;

-- RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.firms TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;

ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access — firms" ON public.firms FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access — users" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);

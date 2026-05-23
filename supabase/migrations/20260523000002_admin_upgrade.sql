-- ============================================================
-- LexFlow: Admin upgrade — team_members, notes, soft-delete,
--          assignment columns
-- Run this in Supabase → SQL Editor → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'associate', -- admin | associate | paralegal
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.team_members(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.team_members(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, -- 'lead' | 'case'
  entity_id uuid NOT NULL,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO service_role;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access — team_members"
  ON public.team_members FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access — notes"
  ON public.notes FOR ALL TO service_role USING (true) WITH CHECK (true);

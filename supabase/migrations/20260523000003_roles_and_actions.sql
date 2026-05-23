-- ============================================================
-- LexFlow: Role refinement + case_actions table
-- Run this in Supabase → SQL Editor → Run
-- ============================================================

ALTER TABLE public.team_members
  DROP CONSTRAINT IF EXISTS team_members_role_check;

UPDATE public.team_members
SET role = 'associate_solicitor'
WHERE role = 'associate';

CREATE TABLE IF NOT EXISTS public.case_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  step text NOT NULL,
  type text NOT NULL,
  urgency text NOT NULL DEFAULT 'medium',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS case_actions_case_id_idx ON public.case_actions(case_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_actions TO service_role;
ALTER TABLE public.case_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access — case_actions"
  ON public.case_actions FOR ALL TO service_role USING (true) WITH CHECK (true);

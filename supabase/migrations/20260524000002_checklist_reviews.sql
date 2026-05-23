ALTER TABLE public.checklist_templates
  ADD COLUMN IF NOT EXISTS gov_url text,
  ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz;

ALTER TABLE public.firm_settings
  ADD COLUMN IF NOT EXISTS email text;

CREATE TABLE IF NOT EXISTS public.checklist_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
  case_type text NOT NULL,
  current_items jsonb NOT NULL,
  proposed_items jsonb NOT NULL,
  changes_summary text NOT NULL,
  gov_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS checklist_reviews_status_idx ON public.checklist_reviews(status);
CREATE INDEX IF NOT EXISTS checklist_reviews_checklist_id_idx ON public.checklist_reviews(checklist_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist_reviews TO service_role;
ALTER TABLE public.checklist_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access — checklist_reviews"
  ON public.checklist_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add gov.uk URLs to existing checklists
UPDATE public.checklist_templates SET gov_url = 'https://www.gov.uk/settlement-refugee-or-humanitarian-protection' WHERE case_type = 'ILR Application';
UPDATE public.checklist_templates SET gov_url = 'https://www.gov.uk/uk-family-visa' WHERE case_type = 'Spouse Visa';
UPDATE public.checklist_templates SET gov_url = 'https://www.gov.uk/student-visa' WHERE case_type = 'Student Visa Extension';
UPDATE public.checklist_templates SET gov_url = 'https://www.gov.uk/skilled-worker-visa' WHERE case_type = 'Work Visa Extension';
UPDATE public.checklist_templates SET gov_url = 'https://www.gov.uk/british-citizenship' WHERE case_type = 'British Citizenship';

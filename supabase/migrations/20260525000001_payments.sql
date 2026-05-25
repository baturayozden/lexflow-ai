CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id uuid NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  payment_type text NOT NULL DEFAULT 'one_time', -- one_time | monthly
  status text NOT NULL DEFAULT 'paid',           -- paid | pending | overdue
  description text,
  paid_at timestamptz,
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.firm_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id uuid NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Baturay',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.firm_notes TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access — payments"
  ON public.payments FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access — firm_notes"
  ON public.firm_notes FOR ALL TO service_role USING (true) WITH CHECK (true);

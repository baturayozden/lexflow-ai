ALTER TABLE public.firms
  ADD COLUMN IF NOT EXISTS notification_prefs jsonb NOT NULL DEFAULT '{"new_case_email":true,"new_lead_email":true,"high_priority_email":true,"daily_digest":false,"weekly_summary":true}'::jsonb;

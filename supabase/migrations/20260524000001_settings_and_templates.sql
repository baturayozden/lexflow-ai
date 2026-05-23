-- ============================================================
-- LexFlow: Settings + template tables
-- Run this in Supabase → SQL Editor → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.firm_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_name text NOT NULL DEFAULT 'My Law Firm',
  logo_url text,
  primary_color text NOT NULL DEFAULT '#c9a84c',
  website text,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_name text NOT NULL DEFAULT 'LexFlow',
  from_email text NOT NULL DEFAULT 'notifications@lexflow.co.uk',
  reply_to text,
  domain_verified boolean NOT NULL DEFAULT false,
  resend_domain_id text,
  signature_html text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type text NOT NULL,
  title text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quote_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type text NOT NULL,
  min_fee integer NOT NULL DEFAULT 500,
  max_fee integer NOT NULL DEFAULT 2000,
  currency text NOT NULL DEFAULT 'GBP',
  vat_included boolean NOT NULL DEFAULT false,
  notes text,
  home_office_fee integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type text NOT NULL UNIQUE,
  subject text NOT NULL,
  body_html text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default checklist templates
INSERT INTO public.checklist_templates (case_type, title, items) VALUES
('ILR Application', 'ILR Application Documents', '["Valid passport and all previous passports","Biometric Residence Permit (BRP)","Continuous residence evidence (utility bills, bank statements for 5 years)","Employment history and payslips","P60s for last 5 years","Life in the UK test pass certificate","English language evidence","Absence from UK record","Police registration certificate (if applicable)","Two passport photos"]'),
('Spouse Visa', 'Spouse Visa Documents', '["Valid passport","Partner''s British passport or BRP","Marriage certificate (if married)","Proof of genuine relationship (photos, communication)","Financial evidence (£29,000 threshold or savings)","English language test certificate","Accommodation evidence","Partner''s P60 and payslips (6 months)","Bank statements (6 months)","Two passport photos"]'),
('Student Visa Extension', 'Student Visa Extension Documents', '["Current BRP and passport","CAS number from sponsor institution","Proof of English language ability","Financial evidence (maintenance funds)","ATAS certificate (if required)","Current course enrollment letter","Bank statements (28 consecutive days)","Accommodation evidence","Two passport photos"]'),
('Work Visa Extension', 'Skilled Worker Visa Documents', '["Current BRP and passport","Certificate of Sponsorship (CoS) from employer","Job offer letter with salary details","Employer''s sponsor licence number","English language evidence","Financial evidence","Payslips (3-6 months)","Bank statements","Two passport photos"]'),
('British Citizenship', 'British Citizenship Documents', '["Current BRP and passport","Proof of 5 years continuous residence","Life in the UK test pass certificate","English language evidence","Absence calculation (must be under 450 days in 5 years)","Employment or study evidence","P60s and payslips","Police registration certificate (if applicable)","Two passport photos","Application fee payment"]');

-- Insert default quote templates
INSERT INTO public.quote_templates (case_type, min_fee, max_fee, currency, vat_included, notes, home_office_fee) VALUES
('ILR Application', 1500, 2500, 'GBP', false, 'Fee depends on complexity and supporting documents required', 2885),
('Spouse Visa', 1500, 2500, 'GBP', false, 'Includes preparation of application and supporting documents', 1846),
('Student Visa Extension', 800, 1500, 'GBP', false, 'Standard extension - fee may vary for complex cases', 490),
('Work Visa Extension', 1000, 1800, 'GBP', false, 'Skilled Worker visa extension - employer sponsorship required', 827),
('British Citizenship', 1200, 2000, 'GBP', false, 'Includes naturalisation application preparation', 1330),
('Family Visa', 1200, 2000, 'GBP', false, 'Various family route visas', 1538);

-- Insert default email templates
INSERT INTO public.email_templates (template_type, subject, body_html) VALUES
('checklist', 'Documents Required for Your {{case_type}} — {{firm_name}}', '<p>Dear {{client_name}},</p><p>Thank you for choosing {{firm_name}}. Please find below the documents required for your {{case_type}} application.</p><p>Please gather these documents and bring them to your appointment or send them securely.</p>{{checklist_items}}<p>If you have any questions, please do not hesitate to contact us.</p><p>Kind regards,<br>{{firm_name}}</p>'),
('quote', 'Fee Estimate for Your {{case_type}} — {{firm_name}}', '<p>Dear {{client_name}},</p><p>Thank you for enquiring about our {{case_type}} services. Please find below our fee estimate.</p>{{quote_details}}<p>This is an estimate only. We will confirm the exact fee following your initial consultation.</p><p>Kind regards,<br>{{firm_name}}</p>'),
('consultation', 'Your Consultation is Confirmed — {{firm_name}}', '<p>Dear {{client_name}},</p><p>Your consultation with {{firm_name}} has been booked.</p>{{consultation_details}}<p>Please bring all relevant documents to your appointment.</p><p>Kind regards,<br>{{firm_name}}</p>'),
('followup', 'Following Up on Your Case — {{firm_name}}', '<p>Dear {{client_name}},</p><p>We are writing to follow up on your {{case_type}} case (Reference: {{reference_id}}).</p><p>{{followup_message}}</p><p>Please do not hesitate to contact us if you have any questions.</p><p>Kind regards,<br>{{firm_name}}</p>');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.firm_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist_templates TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_templates TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO service_role;

ALTER TABLE public.firm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access — firm_settings" ON public.firm_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access — email_settings" ON public.email_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access — checklist_templates" ON public.checklist_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access — quote_templates" ON public.quote_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access — email_templates" ON public.email_templates FOR ALL TO service_role USING (true) WITH CHECK (true);

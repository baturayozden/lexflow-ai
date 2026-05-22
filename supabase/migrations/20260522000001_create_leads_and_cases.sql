-- ============================================================
-- LexFlow: leads + cases tables
-- Run this in Supabase → SQL Editor → Run
-- ============================================================

-- ─── LEADS ──────────────────────────────────────────────────
-- Captures contact-form submissions from the landing page

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),

  -- Contact details
  name          text        not null,
  firm_name     text        not null,
  email         text        not null,
  phone         text,

  -- Qualification
  firm_type     text        not null,   -- Immigration | Conveyancing | Employment | Family
  message       text,

  -- Metadata
  status        text        not null default 'new',   -- new | contacted | qualified | closed
  source        text        not null default 'contact_form',

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists leads_email_idx      on public.leads (email);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS: service role can read/write; anon cannot touch this table
alter table public.leads enable row level security;

create policy "Service role full access — leads"
  on public.leads
  for all
  to service_role
  using (true)
  with check (true);


-- ─── CASES ──────────────────────────────────────────────────
-- Captures demo submissions from /demo — AI-summarised case records

create table if not exists public.cases (
  id            uuid primary key default gen_random_uuid(),

  -- Client identity
  client_name   text        not null,
  client_email  text        not null,
  client_phone  text,

  -- Case details
  nationality   text        not null,
  visa_type     text        not null,
  visa_expiry   date,
  case_type     text        not null,   -- e.g. ILR | Spouse Visa | Student Visa
  description   text        not null,

  -- AI output
  ai_summary    text        not null,

  -- Geolocation (from demo submission)
  ip            text,
  city          text,
  country       text,

  -- Reference shown to the user after submission
  reference_id  text        not null unique,

  -- Workflow
  status        text        not null default 'new',   -- new | reviewed | archived

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger cases_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

-- Indexes
create index if not exists cases_client_email_idx  on public.cases (client_email);
create index if not exists cases_reference_id_idx  on public.cases (reference_id);
create index if not exists cases_status_idx        on public.cases (status);
create index if not exists cases_created_at_idx    on public.cases (created_at desc);

-- RLS: service role full access; anon blocked
alter table public.cases enable row level security;

create policy "Service role full access — cases"
  on public.cases
  for all
  to service_role
  using (true)
  with check (true);

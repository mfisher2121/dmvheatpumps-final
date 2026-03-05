-- DMV Heat Pumps: minimal Supabase schema
-- Apply in Supabase SQL editor or via migrations.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text null,
  zip text not null,
  message text null,
  source text not null default 'api'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_zip_idx on public.leads (zip);

alter table public.leads enable row level security;

-- No public policies are added by default.
-- Use the service role key (server-side only) to insert leads, or add a narrow insert policy if desired.

create table if not exists public.report_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text null,
  zip text null,
  context jsonb null
);

create index if not exists report_requests_created_at_idx on public.report_requests (created_at desc);
create index if not exists report_requests_email_idx on public.report_requests (email);

alter table public.report_requests enable row level security;

create table if not exists public.hp_incentive_programs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  active boolean not null default true,
  state text null check (state in ('DC','MD','VA')),
  utility text not null,
  program_name text not null,
  amount_usd numeric not null default 0,
  notes text null,
  source_url text null
);

create index if not exists hp_incentive_programs_active_idx on public.hp_incentive_programs (active);
create index if not exists hp_incentive_programs_utility_idx on public.hp_incentive_programs (utility);
create index if not exists hp_incentive_programs_state_idx on public.hp_incentive_programs (state);

alter table public.hp_incentive_programs enable row level security;



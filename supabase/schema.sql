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


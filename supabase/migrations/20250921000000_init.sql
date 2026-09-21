-- Elite Career Launchpad · full schema
-- Run this once in the Supabase SQL editor (or via supabase db push)

create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type stage as enum ('Applied', 'OA', 'Tech', 'HR', 'Offer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type application_status as enum ('active', 'offer', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type drive_type as enum ('Full-time', 'Internship', 'Intern + PPO');
exception when duplicate_object then null;
end $$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  initials text not null,
  roll text not null unique,
  branch text not null,
  cgpa real not null default 0,
  backlogs integer not null default 0,
  grad_year integer not null,
  readiness integer not null default 0,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Drives (public)
create table if not exists public.drives (
  id text primary key,
  company text not null,
  role text not null,
  location text not null,
  type drive_type not null,
  ctc text not null,
  deadline timestamptz not null,
  cgpa_cutoff real not null,
  branches text[] not null,
  backlogs_allowed boolean not null default false,
  seats integer not null,
  applicants integer not null default 0,
  rounds text[] not null,
  about text not null,
  skills text[] not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists drives_deadline_idx on public.drives (deadline);

-- Applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  drive_id text not null references public.drives (id) on delete cascade,
  stage stage not null default 'Applied',
  status application_status not null default 'active',
  next_action text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, drive_id)
);

create index if not exists applications_user_idx on public.applications (user_id);
create index if not exists applications_drive_idx on public.applications (drive_id);

-- Application history
create table if not exists public.application_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  stage stage not null,
  note text not null,
  happened_at timestamptz not null default now()
);

-- Interviews / calendar
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  drive_id text references public.drives (id) on delete set null,
  company text not null,
  label text not null,
  starts_at timestamptz not null,
  mode text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists interviews_user_starts_idx on public.interviews (user_id, starts_at);

-- Prep tracks
create table if not exists public.prep_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  progress integer not null default 0,
  items_label text not null,
  tag text not null,
  sort_order integer not null default 0
);

-- Profile Lab checks (GitHub + LinkedIn)
create table if not exists public.profile_checks (
  id text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text not null check (category in ('github', 'linkedin')),
  title text not null,
  weight integer not null,
  done boolean not null default false,
  why text not null,
  how text not null,
  primary key (id, user_id)
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, initials, roll, branch, cgpa, backlogs, grad_year, readiness)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'name', new.email), 2)),
    coalesce(new.raw_user_meta_data->>'roll', 'TEMP' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'branch', 'CSE'),
    coalesce((new.raw_user_meta_data->>'cgpa')::real, 0),
    coalesce((new.raw_user_meta_data->>'backlogs')::integer, 0),
    coalesce((new.raw_user_meta_data->>'grad_year')::integer, 2026),
    0
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.drives enable row level security;
alter table public.applications enable row level security;
alter table public.application_history enable row level security;
alter table public.interviews enable row level security;
alter table public.prep_tracks enable row level security;
alter table public.profile_checks enable row level security;

-- Profiles: own row only
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Drives: public read
create policy "drives_select_all" on public.drives for select using (true);

-- Applications: own only
create policy "applications_select_own" on public.applications for select using (auth.uid() = user_id);
create policy "applications_insert_own" on public.applications for insert with check (auth.uid() = user_id);
create policy "applications_update_own" on public.applications for update using (auth.uid() = user_id);
create policy "applications_delete_own" on public.applications for delete using (auth.uid() = user_id);

-- History: via application ownership
create policy "history_select_own" on public.application_history for select
  using (exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = auth.uid()
  ));
create policy "history_insert_own" on public.application_history for insert
  with check (exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = auth.uid()
  ));

-- Interviews: own
create policy "interviews_select_own" on public.interviews for select using (auth.uid() = user_id);
create policy "interviews_insert_own" on public.interviews for insert with check (auth.uid() = user_id);
create policy "interviews_update_own" on public.interviews for update using (auth.uid() = user_id);
create policy "interviews_delete_own" on public.interviews for delete using (auth.uid() = user_id);

-- Prep: own
create policy "prep_select_own" on public.prep_tracks for select using (auth.uid() = user_id);
create policy "prep_insert_own" on public.prep_tracks for insert with check (auth.uid() = user_id);
create policy "prep_update_own" on public.prep_tracks for update using (auth.uid() = user_id);
create policy "prep_delete_own" on public.prep_tracks for delete using (auth.uid() = user_id);

-- Profile checks: own
create policy "checks_select_own" on public.profile_checks for select using (auth.uid() = user_id);
create policy "checks_insert_own" on public.profile_checks for insert with check (auth.uid() = user_id);
create policy "checks_update_own" on public.profile_checks for update using (auth.uid() = user_id);
create policy "checks_delete_own" on public.profile_checks for delete using (auth.uid() = user_id);

-- Grant usage
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

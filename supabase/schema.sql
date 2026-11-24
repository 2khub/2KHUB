-- 2UHub accounts and roster community.
-- Paste this whole file into Supabase: SQL Editor > New query > Run. It is safe to run once on a new project.
-- Nothing secret is in this file. The access rules (row level security) are what protect the data.

-- ------------------------------------------------------------------ profiles: one per signed-in user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (char_length(display_name) between 3 and 24 and display_name ~ '^[A-Za-z0-9_ .-]+$'),
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_display_name_ci on public.profiles (lower(display_name));

alter table public.profiles enable row level security;
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (true);
drop policy if exists "create own profile" on public.profiles;
create policy "create own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "change own profile" on public.profiles;
create policy "change own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ------------------------------------------------------------------ rosters shared in the community
create table if not exists public.rosters (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  description text not null default '' check (char_length(description) <= 300),
  brands jsonb not null default '[]'::jsonb,   -- no longer used: rosters carry no show names
  superstars jsonb not null check (jsonb_typeof(superstars) = 'array' and jsonb_array_length(superstars) between 2 and 500),
  preview jsonb not null default '[]'::jsonb check (jsonb_typeof(preview) = 'array' and jsonb_array_length(preview) <= 5),
  star_count int generated always as (jsonb_array_length(superstars)) stored,
  is_public boolean not null default true,
  reports int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rosters_payload_size check (pg_column_size(superstars) < 1500000)
);
create index if not exists rosters_created_idx on public.rosters (created_at desc);
alter table public.rosters drop constraint if exists rosters_superstars_check;
alter table public.rosters add constraint rosters_superstars_check check (jsonb_typeof(superstars) = 'array' and jsonb_array_length(superstars) between 2 and 500) not valid;

alter table public.rosters enable row level security;
drop policy if exists "read public rosters" on public.rosters;
create policy "read public rosters" on public.rosters for select
  using ((is_public and reports < 5) or owner = auth.uid());
drop policy if exists "share own roster" on public.rosters;
create policy "share own roster" on public.rosters for insert with check (owner = auth.uid());
drop policy if exists "edit own roster" on public.rosters;
create policy "edit own roster" on public.rosters for update using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "delete own roster" on public.rosters;
create policy "delete own roster" on public.rosters for delete using (owner = auth.uid());

-- owners may change the content, never the owner, the report count or the date
revoke update on public.rosters from authenticated, anon;
grant update (name, description, brands, superstars, preview, is_public, updated_at) on public.rosters to authenticated;

-- Rosters can be kept private in the account (is_public = false) or shared (true).
-- Keeping rosters private: up to 100 per person. Sharing: at most one a minute and five a day.
alter table public.rosters add column if not exists shared_at timestamptz;
update public.rosters set shared_at = created_at where is_public and shared_at is null;
create index if not exists rosters_shared_idx on public.rosters (shared_at desc);

create or replace function public.limit_roster_uploads() returns trigger
language plpgsql security definer set search_path = public as $$
declare sharing_now boolean := false;
begin
  if tg_op = 'INSERT' then
    if (select count(*) from public.rosters where owner = new.owner) >= 100 then
      raise exception 'You can keep up to 100 rosters in your account.';
    end if;
    sharing_now := new.is_public;
  elsif new.is_public and not old.is_public then
    sharing_now := true;
  end if;
  if sharing_now then
    if (select count(*) from public.rosters where owner = new.owner and shared_at > now() - interval '1 minute') >= 1 then
      raise exception 'Please wait a minute before sharing again.';
    end if;
    if (select count(*) from public.rosters where owner = new.owner and shared_at > now() - interval '1 day') >= 5 then
      raise exception 'You can share up to 5 rosters per day.';
    end if;
    new.shared_at := now();
  end if;
  return new;
end $$;
drop trigger if exists limit_roster_uploads on public.rosters;
create trigger limit_roster_uploads before insert or update on public.rosters for each row execute function public.limit_roster_uploads();

-- ------------------------------------------------------------------ reports (one per person per roster)
create table if not exists public.roster_reports (
  roster_id uuid not null references public.rosters (id) on delete cascade,
  reporter uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (roster_id, reporter)
);
alter table public.roster_reports enable row level security;
drop policy if exists "report as yourself" on public.roster_reports;
create policy "report as yourself" on public.roster_reports for insert with check (reporter = auth.uid());
-- nobody can read the reports from the website; look at them in the Supabase table view

create or replace function public.count_report() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.rosters set reports = reports + 1 where id = new.roster_id;
  return new;
end $$;
drop trigger if exists count_report on public.roster_reports;
create trigger count_report after insert on public.roster_reports for each row execute function public.count_report();

-- ------------------------------------------------------------------ delete my account (also removes my profile, rosters and reports)
create or replace function public.delete_my_account() returns void
language sql security definer set search_path = public as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ------------------------------------------------------------------ let the website use these tables
-- New Supabase projects do not open tables to the website automatically, so say exactly what is allowed.
-- (The row level security rules above still decide which rows each person can touch.)
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select on public.rosters to anon, authenticated;
grant insert, delete on public.rosters to authenticated;
grant insert on public.roster_reports to authenticated;

-- ------------------------------------------------------------------ clean up the admin experiment (safe to run, even if it was never set up)
-- Run this AFTER the rest of this file has run. Your rosters are kept.
drop function if exists public.is_admin();
drop table if exists public.site_admins;

-- rosters no longer carry shows: allow an empty list on tables made before this change
alter table public.rosters drop constraint if exists rosters_brands_check;
alter table public.rosters alter column brands set default '[]'::jsonb;

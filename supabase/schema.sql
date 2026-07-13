create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'client' check (role in ('admin', 'client')),
  name text not null default 'Estate Client',
  company text not null default 'Private Client',
  phone_number text not null default '',
  professional_title text not null default 'Client Account',
  avatar_url text not null default '',
  preferred_language text not null default 'English (International)',
  currency text not null default 'USD ($)',
  email_notifications boolean not null default true,
  market_insights boolean not null default true,
  dark_mode boolean not null default false,
  total_assets text not null default '$0.0M',
  active_build_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  project_name text not null,
  location text not null,
  category text not null check (category in ('Residential', 'Commercial', 'Acquisitions')),
  status text not null check (status in ('In Progress', 'Finalized', 'Design Phase', 'Excavation', 'Occupied')),
  units integer not null default 1,
  description text not null default '',
  architectural_narrative text not null default '',
  notes text not null default '',
  beds text not null default '—',
  baths text not null default '—',
  living_area text not null default 'N/A',
  acreage text not null default 'N/A',
  built_year text not null default 'N/A',
  garage text not null default 'N/A',
  amenities text not null default 'N/A',
  price text not null default 'Price Upon Request',
  tour_embed_url text not null default '',
  showcase_scene_name text not null default 'Primary Tour',
  showcase_scene_category text not null default 'Main Space',
  showcase_scene_description text not null default 'Primary immersive client tour.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_type text not null check (asset_type in ('tour_360', 'floor_plan', 'thumbnail', 'hero_image', 'attachment')),
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_client_user_idx on public.projects (client_user_id);
create index if not exists project_assets_project_idx on public.project_assets (project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    role,
    name,
    company,
    phone_number,
    professional_title,
    avatar_url
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'company', 'Estate Client')),
    coalesce(new.raw_user_meta_data->>'company', 'Private Client'),
    coalesce(new.raw_user_meta_data->>'phone_number', ''),
    case
      when coalesce(new.raw_user_meta_data->>'role', 'client') = 'admin' then 'Portal Administrator'
      else 'Client Account'
    end,
    ''
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_assets enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "projects_select_assigned_or_admin" on public.projects;
create policy "projects_select_assigned_or_admin"
on public.projects
for select
to authenticated
using (client_user_id = auth.uid() or public.is_admin());

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- The share page reads only this curated project data through a security-definer RPC.
-- The underlying projects and assets remain protected by their RLS policies.
create or replace function public.get_shared_tour(shared_project_id uuid)
returns table (
  id uuid,
  project_name text,
  location text,
  description text,
  category text,
  status text,
  beds text,
  baths text,
  living_area text,
  acreage text,
  built_year text,
  garage text,
  amenities text,
  price text,
  tour_embed_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    projects.id,
    projects.project_name,
    projects.location,
    projects.description,
    projects.category,
    projects.status,
    projects.beds,
    projects.baths,
    projects.living_area,
    projects.acreage,
    projects.built_year,
    projects.garage,
    projects.amenities,
    projects.price,
    projects.tour_embed_url,
    projects.created_at
  from public.projects
  where projects.id = shared_project_id;
$$;

grant execute on function public.get_shared_tour(uuid) to anon, authenticated;

drop policy if exists "project_assets_select_assigned_or_admin" on public.project_assets;
create policy "project_assets_select_assigned_or_admin"
on public.project_assets
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.projects
    where projects.id = project_assets.project_id
      and projects.client_user_id = auth.uid()
  )
);

drop policy if exists "project_assets_admin_write" on public.project_assets;
create policy "project_assets_admin_write"
on public.project_assets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;

drop policy if exists "project_assets_bucket_admin_all" on storage.objects;
create policy "project_assets_bucket_admin_all"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-assets' and public.is_admin())
with check (bucket_id = 'project-assets' and public.is_admin());

drop policy if exists "project_assets_bucket_client_read" on storage.objects;
create policy "project_assets_bucket_client_read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-assets'
  and exists (
    select 1
    from public.project_assets
    join public.projects on projects.id = project_assets.project_id
    where project_assets.storage_path = storage.objects.name
      and projects.client_user_id = auth.uid()
  )
);

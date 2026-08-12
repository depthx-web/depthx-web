-- Depth X content schema (spec §4) + role-based access (spec §6).
-- Run this against a fresh Supabase project: SQL Editor -> paste -> Run,
-- or `supabase db push` if you're using the Supabase CLI.

create extension if not exists "pgcrypto";

-- ---------- profiles & roles ----------

create type user_role as enum ('admin', 'editor');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- New auth users get a profile row automatically (role defaults to 'editor';
-- promote the first user to 'admin' manually, see README "Connecting the
-- real CMS").
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create function is_editor_or_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- content tables ----------

create table research_domains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text,
  "order" int not null default 0
);

create type project_status as enum ('granted', 'pending', 'licensing');

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status project_status not null default 'pending',
  research_domain_id uuid references research_domains (id) on delete set null,
  short_description text not null default '',
  overview text not null default '',
  patent_number text,
  filed_date date,
  granted_date date,
  readiness_stage smallint not null default 1 check (readiness_stage between 1 and 3),
  featured boolean not null default false,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null default '',
  year int not null,
  abstract text not null default '',
  related_project_id uuid references projects (id) on delete set null
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo_url text,
  "order" int not null default 0
);

create table news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  tag text not null default '',
  excerpt text not null default '',
  body text not null default '',
  date date not null default current_date,
  published boolean not null default true
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution_name text not null default '',
  attribution_role text not null default ''
);

create type faq_category as enum ('licensing', 'general');

create table faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  category faq_category not null default 'general',
  "order" int not null default 0
);

create table partnership_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default ''
);

-- Singleton row (spec §4.1). App code always reads/writes id = 1.
create table site_settings (
  id smallint primary key default 1 check (id = 1),
  hero_headline text not null default '',
  hero_headline_accent text not null default '',
  hero_subtext text not null default '',
  stats jsonb not null default '[]',
  trust_bar_logos jsonb not null default '[]',
  footer_text text not null default '',
  contact_email_investor text not null default '',
  contact_email_researcher text not null default '',
  contact_email_company text not null default '',
  section_visibility jsonb not null default '{}'
);

insert into site_settings (id) values (1);

-- ---------- row level security ----------
-- Public (anon key): read-only, and only rows meant to be public.
-- Editors and admins (authenticated, via profiles.role): full read/write on
-- content tables. Only admins can touch site_settings or profiles.

alter table research_domains enable row level security;
alter table projects enable row level security;
alter table publications enable row level security;
alter table team_members enable row level security;
alter table news_posts enable row level security;
alter table testimonials enable row level security;
alter table faq_items enable row level security;
alter table partnership_types enable row level security;
alter table site_settings enable row level security;
alter table profiles enable row level security;

-- research_domains: fully public read (no visibility flag on this type)
create policy "public read research_domains" on research_domains for select using (true);
create policy "editors write research_domains" on research_domains for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

-- projects: public read only visible rows; editors read/write everything
create policy "public read visible projects" on projects for select using (visible = true);
create policy "editors read all projects" on projects for select using (is_editor_or_admin());
create policy "editors write projects" on projects for insert with check (is_editor_or_admin());
create policy "editors update projects" on projects for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete projects" on projects for delete using (is_editor_or_admin());

create policy "public read publications" on publications for select using (true);
create policy "editors write publications" on publications for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

create policy "public read team_members" on team_members for select using (true);
create policy "editors write team_members" on team_members for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

create policy "public read published news_posts" on news_posts for select using (published = true);
create policy "editors read all news_posts" on news_posts for select using (is_editor_or_admin());
create policy "editors write news_posts" on news_posts for insert with check (is_editor_or_admin());
create policy "editors update news_posts" on news_posts for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete news_posts" on news_posts for delete using (is_editor_or_admin());

create policy "public read testimonials" on testimonials for select using (true);
create policy "editors write testimonials" on testimonials for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

create policy "public read faq_items" on faq_items for select using (true);
create policy "editors write faq_items" on faq_items for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

create policy "public read partnership_types" on partnership_types for select using (true);
create policy "editors write partnership_types" on partnership_types for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

-- site_settings: public read (the public site needs it), admin-only write
create policy "public read site_settings" on site_settings for select using (true);
create policy "admins write site_settings" on site_settings for update
  using (is_admin()) with check (is_admin());

-- profiles: a user reads their own row; admins read/manage all
create policy "self read profile" on profiles for select using (auth.uid() = id);
create policy "admins read all profiles" on profiles for select using (is_admin());
create policy "admins update profiles" on profiles for update
  using (is_admin()) with check (is_admin());

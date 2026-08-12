-- Adds: legal pages, per-item SEO keywords, contact message inbox,
-- self-hosted page-view analytics, news post images, per-project HTML
-- product simulator embeds. Run after 0001_init.sql.

-- ---------- SEO keywords on every content type ----------

alter table projects add column keywords text not null default '';
alter table research_domains add column keywords text not null default '';
alter table publications add column keywords text not null default '';
alter table team_members add column keywords text not null default '';
alter table news_posts add column keywords text not null default '';
alter table testimonials add column keywords text not null default '';
alter table faq_items add column keywords text not null default '';
alter table partnership_types add column keywords text not null default '';

-- ---------- news post image, project HTML simulator ----------

alter table news_posts add column image_url text;
alter table projects add column simulator_html text;

-- ---------- legal pages (admin-only write, public read) ----------

create table legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

alter table legal_pages enable row level security;
create policy "public read legal_pages" on legal_pages for select using (true);
create policy "admins write legal_pages" on legal_pages for update
  using (is_admin()) with check (is_admin());

-- ---------- contact messages (public insert, editor/admin read) ----------

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null default 'other',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;
create policy "public insert contact_messages" on contact_messages for insert with check (true);
create policy "editors read contact_messages" on contact_messages for select using (is_editor_or_admin());
create policy "editors update contact_messages" on contact_messages for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "admins delete contact_messages" on contact_messages for delete using (is_admin());

-- ---------- page views (public insert, editor/admin read) ----------

create table page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  country text not null default 'Unknown',
  created_at timestamptz not null default now()
);
create index page_views_created_at_idx on page_views (created_at);
create index page_views_path_idx on page_views (path);

alter table page_views enable row level security;
create policy "public insert page_views" on page_views for insert with check (true);
create policy "editors read page_views" on page_views for select using (is_editor_or_admin());

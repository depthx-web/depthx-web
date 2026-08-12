-- Adds per-item show/hide to every remaining content type (previously only
-- projects.visible and news_posts.published supported this), and a
-- newsletter_subscribers table for the homepage signup form.

-- ---------- per-item visibility ----------

alter table research_domains add column visible boolean not null default true;
alter table publications add column visible boolean not null default true;
alter table team_members add column visible boolean not null default true;
alter table testimonials add column visible boolean not null default true;
alter table faq_items add column visible boolean not null default true;
alter table partnership_types add column visible boolean not null default true;

-- Replace each table's blanket "public read everything" + "editors write
-- everything" policy pair with the visible/all-rows split already used by
-- projects and news_posts.

drop policy "public read research_domains" on research_domains;
drop policy "editors write research_domains" on research_domains;
create policy "public read visible research_domains" on research_domains for select using (visible = true);
create policy "editors read all research_domains" on research_domains for select using (is_editor_or_admin());
create policy "editors insert research_domains" on research_domains for insert with check (is_editor_or_admin());
create policy "editors update research_domains" on research_domains for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete research_domains" on research_domains for delete using (is_editor_or_admin());

drop policy "public read publications" on publications;
drop policy "editors write publications" on publications;
create policy "public read visible publications" on publications for select using (visible = true);
create policy "editors read all publications" on publications for select using (is_editor_or_admin());
create policy "editors insert publications" on publications for insert with check (is_editor_or_admin());
create policy "editors update publications" on publications for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete publications" on publications for delete using (is_editor_or_admin());

drop policy "public read team_members" on team_members;
drop policy "editors write team_members" on team_members;
create policy "public read visible team_members" on team_members for select using (visible = true);
create policy "editors read all team_members" on team_members for select using (is_editor_or_admin());
create policy "editors insert team_members" on team_members for insert with check (is_editor_or_admin());
create policy "editors update team_members" on team_members for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete team_members" on team_members for delete using (is_editor_or_admin());

drop policy "public read testimonials" on testimonials;
drop policy "editors write testimonials" on testimonials;
create policy "public read visible testimonials" on testimonials for select using (visible = true);
create policy "editors read all testimonials" on testimonials for select using (is_editor_or_admin());
create policy "editors insert testimonials" on testimonials for insert with check (is_editor_or_admin());
create policy "editors update testimonials" on testimonials for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete testimonials" on testimonials for delete using (is_editor_or_admin());

drop policy "public read faq_items" on faq_items;
drop policy "editors write faq_items" on faq_items;
create policy "public read visible faq_items" on faq_items for select using (visible = true);
create policy "editors read all faq_items" on faq_items for select using (is_editor_or_admin());
create policy "editors insert faq_items" on faq_items for insert with check (is_editor_or_admin());
create policy "editors update faq_items" on faq_items for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete faq_items" on faq_items for delete using (is_editor_or_admin());

drop policy "public read partnership_types" on partnership_types;
drop policy "editors write partnership_types" on partnership_types;
create policy "public read visible partnership_types" on partnership_types for select using (visible = true);
create policy "editors read all partnership_types" on partnership_types for select using (is_editor_or_admin());
create policy "editors insert partnership_types" on partnership_types for insert with check (is_editor_or_admin());
create policy "editors update partnership_types" on partnership_types for update
  using (is_editor_or_admin()) with check (is_editor_or_admin());
create policy "editors delete partnership_types" on partnership_types for delete using (is_editor_or_admin());

-- ---------- newsletter ----------

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "public subscribe to newsletter" on newsletter_subscribers for insert with check (true);
create policy "editors read newsletter_subscribers" on newsletter_subscribers for select using (is_editor_or_admin());
create policy "admins delete newsletter_subscribers" on newsletter_subscribers for delete using (is_admin());

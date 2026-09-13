-- Supabase security lints 0024, 0028, and 0029.
-- Keep public form ingestion, but require structurally valid rows instead of
-- allowing unconditional INSERT/DELETE policies.

drop policy if exists "public insert contact_messages" on public.contact_messages;
create policy "public insert contact_messages"
  on public.contact_messages for insert
  with check (
    length(btrim(name)) between 1 and 200
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and length(btrim(message)) between 1 and 10000
  );

drop policy if exists "public subscribe to newsletter" on public.newsletter_subscribers;
create policy "public subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');

drop policy if exists "public insert page_views" on public.page_views;
create policy "public insert page_views"
  on public.page_views for insert
  with check (length(btrim(path)) between 1 and 2048);

-- Unsubscribe is handled server-side with the service-role client. Do not
-- expose a public DELETE policy that can delete an arbitrary subscriber row.
drop policy if exists "public unsubscribe from newsletter" on public.newsletter_subscribers;

-- Keep SECURITY DEFINER helpers outside the PostgREST-exposed public schema.
create schema if not exists private;
alter function public.handle_new_user() set schema private;
alter function public.is_admin() set schema private;
alter function public.is_editor_or_admin() set schema private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;
grant execute on function private.is_editor_or_admin() to anon, authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;

-- Supabase security lint 0013: lock down legacy public tables that are not
-- used by this Next.js application. With RLS enabled and no policies, the
-- tables are deny-by-default for anon/authenticated PostgREST clients.
-- The service role remains able to manage them when required.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'payload_kv',
    'payload_locked_documents',
    'payload_preferences',
    'payload_preferences_rels',
    'payload_migrations',
    'payload_locked_documents_rels',
    'patents',
    'research_areas',
    'team',
    'inquiries',
    'users_sessions',
    'users',
    'media'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
    end if;
  end loop;
end $$;

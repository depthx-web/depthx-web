import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Anonymous, cookie-free client for public reads (src/lib/content.ts).
 * Every query this client makes is governed by the "public read ..." RLS
 * policies in supabase/migrations/0001_init.sql — it never needs to know
 * who's logged in, so it must NOT depend on cookies()/request context like
 * the SSR client in server.ts does. Using the cookie-aware client here was
 * a real bug: it broke `generateStaticParams` (which runs at build time,
 * outside any request) and would have silently forced every public page
 * into dynamic, per-request rendering instead of the static shell it should
 * get. Admin routes (src/lib/admin/auth.ts, src/lib/supabase/server.ts)
 * genuinely need the cookie-aware client, since they must know the current
 * user for role checks — this file is only for the public site.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

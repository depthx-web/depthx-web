import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { SUPABASE_URL } from "@/lib/supabase/env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const hasServiceRoleConfig = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

/**
 * Service-role client — bypasses RLS entirely and can call Supabase's Auth
 * admin API (creating users directly, without an email confirmation step).
 * `import "server-only"` makes any accidental import from a Client Component
 * a build error rather than a leaked secret. Only ever call this from
 * Server Actions already gated by requireAdmin() (src/app/admin/actions/users.ts)
 * — this client itself has no notion of who's calling it.
 */
export function createAdminClient() {
  if (!hasServiceRoleConfig) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

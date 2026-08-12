import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * For Server Components/Actions/Route Handlers. Always create a fresh client
 * per request — don't store this in a module-level variable (breaks with
 * Fluid compute / concurrent requests using different sessions).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component during render — safe to ignore
          // since the proxy (src/proxy.ts) refreshes the session on every
          // navigation anyway.
        }
      },
    },
  });
}

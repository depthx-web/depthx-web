import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` — this is that file, not
// a leftover. See node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};

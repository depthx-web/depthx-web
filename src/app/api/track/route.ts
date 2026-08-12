import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";

// Self-hosted, cookie-free pageview counter (spec: "summary of the traffic
// and number of visits and which country" in the Admin Panel). No cookies,
// no cross-session tracking — just a path + country + timestamp per request,
// fired by src/components/page-tracker.tsx.
//
// Country is resolved from platform geo headers where available (Vercel,
// Cloudflare), falling back to a keyless IP lookup (ip-api.com's free tier —
// rate-limited to ~45 req/min per outbound IP, fine for getting started, but
// swap to Plausible/GA4 — already scaffolded in src/components/analytics.tsx
// — if you need production-scale accuracy).

async function resolveCountry(request: NextRequest): Promise<string> {
  const platformCountry =
    request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
  if (platformCountry && platformCountry !== "XX") return platformCountry;

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    request.headers.get("x-real-ip");
  if (!ip || ip === "127.0.0.1" || ip === "::1") return "Unknown";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return data.status === "success" && data.countryCode ? data.countryCode : "Unknown";
  } catch {
    return "Unknown";
  }
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseConfig) return NextResponse.json({ tracked: false });

  let path: string;
  try {
    const body = await request.json();
    path = String(body.path || "/").slice(0, 512);
  } catch {
    return NextResponse.json({ tracked: false }, { status: 400 });
  }

  const country = await resolveCountry(request);
  const supabase = createPublicClient();
  await supabase.from("page_views").insert({ path, country });

  return NextResponse.json({ tracked: true });
}

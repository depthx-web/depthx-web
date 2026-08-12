import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// On-demand ISR (spec §7). In the Supabase dashboard, add a Database Webhook
// (Database -> Webhooks) for each table below, POSTing to this route on
// Insert/Update/Delete, with an HTTP header "x-webhook-secret" matching
// SUPABASE_REVALIDATE_SECRET. Supabase's webhook payload shape is fixed:
//   { type: "INSERT"|"UPDATE"|"DELETE", table: string, record: {...}, old_record: {...} }
// See README.md "Connecting the real CMS" for setup steps.

type WebhookPayload = {
  table?: string;
  record?: { slug?: string };
  old_record?: { slug?: string };
};

const PATHS_BY_TABLE: Record<string, string[]> = {
  projects: ["/", "/projects", "/investors"],
  publications: ["/publications"],
  team_members: ["/team"],
  news_posts: ["/news"],
  testimonials: ["/investors"],
  faq_items: ["/investors"],
  research_domains: ["/", "/research"],
  partnership_types: ["/collaboration"],
  site_settings: ["/"],
};

export async function POST(request: NextRequest) {
  const secret = process.env.SUPABASE_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "SUPABASE_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }
  if (request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  let body: WebhookPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const table = body.table;
  if (!table || !(table in PATHS_BY_TABLE)) {
    return NextResponse.json(
      { revalidated: false, message: `Unknown or missing table: ${table ?? "(none)"}` },
      { status: 400 },
    );
  }

  const paths = [...PATHS_BY_TABLE[table]];
  const slug = body.record?.slug ?? body.old_record?.slug;
  if (table === "projects" && slug) paths.push(`/projects/${slug}`);
  if (table === "news_posts" && slug) paths.push(`/news/${slug}`);

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths, now: Date.now() });
}

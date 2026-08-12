import { NextRequest } from "next/server";
import { createAdminClient, hasServiceRoleConfig } from "@/lib/supabase/admin";
import { sendCampaignToSubscribers } from "@/app/admin/actions/campaigns";

/**
 * Triggered by Vercel Cron (see vercel.json) — no logged-in user, so it uses
 * the service-role client (RLS would otherwise block both reading
 * newsletter_subscribers and writing email_campaigns for an anonymous
 * caller). Authenticated via CRON_SECRET rather than requireAdmin(), since
 * there's no admin session to check.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (!hasServiceRoleConfig) {
    return Response.json({ sent: 0, note: "SUPABASE_SERVICE_ROLE_KEY not configured" });
  }

  const supabase = createAdminClient();
  const { data: due } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString());

  const results = [];
  for (const campaign of due ?? []) {
    const sentCount = await sendCampaignToSubscribers(supabase, campaign);
    results.push({ id: campaign.id, subject: campaign.subject, sentCount });
  }

  return Response.json({ processed: results.length, results });
}

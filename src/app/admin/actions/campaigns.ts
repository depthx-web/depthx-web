"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { appendEmailFooter } from "@/lib/email/template";
import { SITE_URL } from "@/lib/site";
import type { Database } from "@/lib/supabase/database.types";

type Campaign = Database["public"]["Tables"]["email_campaigns"]["Row"];
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type CampaignActionState = { error: string | null };

export async function createCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const profile = await requireProfile();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const scheduledAtRaw = String(formData.get("scheduled_at") || "").trim();
  if (!subject || !body) return { error: "Subject and body are both required." };

  let scheduledAt: string | null = null;
  if (scheduledAtRaw) {
    const parsed = new Date(scheduledAtRaw);
    if (Number.isNaN(parsed.getTime())) return { error: "Invalid scheduled date/time." };
    if (parsed.getTime() <= Date.now()) return { error: "Scheduled time must be in the future." };
    scheduledAt = parsed.toISOString();
  }

  const supabase = await createClient();
  const { error } = await supabase.from("email_campaigns").insert({
    subject,
    body,
    created_by: profile.id,
    status: scheduledAt ? "scheduled" : "draft",
    scheduled_at: scheduledAt,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?created=1");
}

export async function deleteCampaignAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("email_campaigns").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/campaigns");
}

/** Reverts a not-yet-sent scheduled campaign back to a draft. */
export async function cancelScheduledCampaignAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("email_campaigns")
    .update({ status: "draft", scheduled_at: null })
    .eq("id", id)
    .eq("status", "scheduled");
  if (error) throw new Error(error.message);
  revalidatePath("/admin/campaigns");
}

/** Sends a campaign to every current newsletter subscriber, one at a time,
 * with a per-subscriber unsubscribe link appended. Records how many
 * actually went out even if some individual sends fail. Shared between the
 * admin "Send now" button and the scheduled-campaign cron route. */
export async function sendCampaignToSubscribers(
  supabase: SupabaseServerClient,
  campaign: Campaign,
): Promise<number> {
  const { data: subscribers } = await supabase.from("newsletter_subscribers").select("id, email");
  const recipients = subscribers ?? [];

  let sentCount = 0;
  for (const subscriber of recipients) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${subscriber.id}`;
    const result = await sendEmail({
      to: subscriber.email,
      subject: campaign.subject,
      text: appendEmailFooter(campaign.body, { unsubscribeUrl }),
    });
    if (result.ok) sentCount += 1;
  }

  const delivered = sentCount > 0;
  await supabase
    .from("email_campaigns")
    .update({
      status: delivered ? "sent" : "failed",
      recipient_count: sentCount,
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaign.id);

  return sentCount;
}

/** Admin-only: sends a draft or scheduled campaign immediately. */
export async function sendCampaignAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", id)
    .single();
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.status === "sent") throw new Error("This campaign has already been sent.");

  const sentCount = await sendCampaignToSubscribers(supabase, campaign);

  revalidatePath("/admin/campaigns");
  // Only claim success when at least one email actually went out — a
  // recipient_count of 0 (e.g. SMTP not configured, or no subscribers)
  // shows as a "failed" status badge on the row instead of a banner.
  redirect(sentCount > 0 ? "/admin/campaigns?sent=1" : "/admin/campaigns");
}

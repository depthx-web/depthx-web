"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { SITE_URL } from "@/lib/site";

export type CampaignActionState = { error: string | null };

export async function createCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const profile = await requireProfile();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!subject || !body) return { error: "Subject and body are both required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("email_campaigns")
    .insert({ subject, body, created_by: profile.id });
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

/** Admin-only: sends the draft to every current newsletter subscriber,
 * one at a time, with a per-subscriber unsubscribe link appended. Records
 * how many actually went out even if some individual sends fail. */
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

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id, email");
  const recipients = subscribers ?? [];

  let sentCount = 0;
  for (const subscriber of recipients) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${subscriber.id}`;
    const result = await sendEmail({
      to: subscriber.email,
      subject: campaign.subject,
      text: `${campaign.body}\n\n—\nYou're receiving this because you subscribed at ${SITE_URL}.\nUnsubscribe: ${unsubscribeUrl}`,
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
    .eq("id", id);

  revalidatePath("/admin/campaigns");
  // Only claim success when at least one email actually went out — a
  // recipient_count of 0 (e.g. SMTP not configured, or no subscribers)
  // shows as a "failed" status badge on the row instead of a banner.
  redirect(delivered ? "/admin/campaigns?sent=1" : "/admin/campaigns");
}

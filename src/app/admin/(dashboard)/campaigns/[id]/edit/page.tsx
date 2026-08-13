import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { CampaignForm } from "@/app/admin/(dashboard)/campaigns/new/campaign-form";

export const metadata: Metadata = { title: "Edit Campaign" };

export default async function EditCampaignPage(props: PageProps<"/admin/campaigns/[id]/edit">) {
  await requireProfile();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) notFound();
  if (campaign.status === "sent") redirect("/admin/campaigns");

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Edit Campaign</h1>
      <p className="mb-8 text-sm text-muted">
        Only draft and scheduled campaigns can be edited — a sent campaign is final.
      </p>
      <CampaignForm
        campaign={{
          id: campaign.id,
          subject: campaign.subject,
          body: campaign.body,
          scheduledAt: campaign.scheduled_at,
          audienceInterest: campaign.audience_interest,
        }}
      />
    </div>
  );
}

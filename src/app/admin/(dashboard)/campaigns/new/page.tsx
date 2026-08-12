import type { Metadata } from "next";
import { requireProfile } from "@/lib/admin/auth";
import { CampaignForm } from "./campaign-form";

export const metadata: Metadata = { title: "New Campaign" };

export default async function NewCampaignPage() {
  await requireProfile();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">New Campaign</h1>
      <p className="mb-8 text-sm text-muted">
        Saved as a draft first — sending is a separate, admin-only step from the campaigns list.
      </p>
      <CampaignForm />
    </div>
  );
}

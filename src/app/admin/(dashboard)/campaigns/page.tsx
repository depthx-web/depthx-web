import type { Metadata } from "next";
import Link from "next/link";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import {
  sendCampaignAction,
  deleteCampaignAction,
  cancelScheduledCampaignAction,
} from "@/app/admin/actions/campaigns";
import { SuccessBanner } from "@/components/admin/success-banner";
import { SendCampaignButton } from "@/components/admin/send-campaign-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { hasSmtpConfig } from "@/lib/email/env";
import { NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "Campaigns" };

const STATUS_STYLE: Record<string, string> = {
  draft: "border-line text-muted",
  sent: "border-green/40 bg-green/10 text-green",
  failed: "border-amber/40 bg-amber/10 text-amber",
  scheduled: "border-blue/40 bg-blue/10 text-blue",
};

export default async function CampaignsPage(props: PageProps<"/admin/campaigns">) {
  const searchParams = await props.searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();
  const [{ data: campaigns }, { data: subscribers }] = await Promise.all([
    supabase.from("email_campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("newsletter_subscribers").select("interests"),
  ]);
  const subscriberCount = subscribers?.length ?? 0;
  const recipientCountFor = (audience: NewsletterInterest | null) =>
    audience
      ? (subscribers ?? []).filter((s) => s.interests.includes(audience)).length
      : subscriberCount;

  const status = typeof searchParams.created !== "undefined"
    ? "created"
    : typeof searchParams.updated !== "undefined"
      ? "updated"
      : typeof searchParams.sent !== "undefined"
        ? "sent"
        : undefined;

  return (
    <div>
      <SuccessBanner status={status} />

      {!hasSmtpConfig && (
        <div className="mb-6 rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          Email sending isn&apos;t configured yet — campaigns can be drafted, but{" "}
          <strong>Send</strong> will fail until SMTP_HOST/PORT/USER/PASSWORD are set in the
          environment.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Email Campaigns</h1>
          <p className="mt-1 text-sm text-muted">
            {subscriberCount ?? 0} subscriber{subscriberCount === 1 ? "" : "s"} will receive a
            sent campaign.
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="rounded-md bg-green px-4 py-2 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97]"
        >
          + New Campaign
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(campaigns ?? []).length === 0 && (
          <p className="text-sm text-muted">No campaigns yet.</p>
        )}
        {(campaigns ?? []).map((c) => (
          <div key={c.id} className="rounded-lg border border-line bg-bg-2 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-1.5 flex items-center gap-2.5">
                  <span className="font-display text-[15px] font-semibold">{c.subject}</span>
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${STATUS_STYLE[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="max-w-xl truncate text-[13px] text-muted">{c.body}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
                  <span>
                    {c.status === "sent"
                      ? `Sent to ${c.recipient_count} · ${new Date(c.sent_at!).toLocaleString()}`
                      : c.status === "scheduled"
                        ? `Scheduled for ${new Date(c.scheduled_at!).toLocaleString()}`
                        : `Drafted ${new Date(c.created_at).toLocaleString()}`}
                  </span>
                  <span className="rounded border border-line px-1.5 py-0.5 uppercase">
                    {c.audience_interest
                      ? NEWSLETTER_INTERESTS.find((i) => i.value === c.audience_interest)?.label
                      : "All subscribers"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                {c.status !== "sent" && (
                  <Link href={`/admin/campaigns/${c.id}/edit`} className="text-blue hover:text-text">
                    Edit
                  </Link>
                )}
                {c.status !== "sent" && profile.role === "admin" && (
                  <SendCampaignButton
                    action={sendCampaignAction.bind(null, c.id)}
                    recipientCount={recipientCountFor(c.audience_interest)}
                  />
                )}
                {c.status === "scheduled" && profile.role === "admin" && (
                  <form action={cancelScheduledCampaignAction.bind(null, c.id)}>
                    <button type="submit" className="text-blue hover:text-text">
                      Cancel schedule
                    </button>
                  </form>
                )}
                {profile.role === "admin" && (
                  <DeleteButton
                    action={deleteCampaignAction.bind(null, c.id)}
                    label={c.subject}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import {
  createCampaignAction,
  updateCampaignAction,
  type CampaignActionState,
} from "@/app/admin/actions/campaigns";
import { NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

const initialState: CampaignActionState = { error: null };

export function CampaignForm({
  campaign,
}: {
  campaign?: {
    id: string;
    subject: string;
    body: string;
    scheduledAt: string | null;
    audienceInterest: NewsletterInterest | null;
  };
}) {
  const action = campaign
    ? updateCampaignAction.bind(null, campaign.id)
    : createCampaignAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  // datetime-local wants "YYYY-MM-DDTHH:mm" in local time, not the full ISO string.
  const scheduledDefault = campaign?.scheduledAt
    ? new Date(
        new Date(campaign.scheduledAt).getTime() -
          new Date(campaign.scheduledAt).getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">
          SUBJECT <span className="text-amber">*</span>
        </span>
        <input
          type="text"
          name="subject"
          required
          defaultValue={campaign?.subject}
          className="w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">
          BODY <span className="text-amber">*</span>
        </span>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={campaign?.body}
          className="w-full resize-y rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
        <span className="text-xs text-muted">
          Plain text. A signature, manage-preferences link, and unsubscribe link are appended
          automatically when sent.
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">SEND TO</span>
        <select
          name="audience_interest"
          defaultValue={campaign?.audienceInterest ?? ""}
          className="w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        >
          <option value="">All subscribers</option>
          {NEWSLETTER_INTERESTS.map((interest) => (
            <option key={interest.value} value={interest.value}>
              Only subscribers interested in: {interest.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">
          SCHEDULE FOR LATER (OPTIONAL)
        </span>
        <input
          type="datetime-local"
          name="scheduled_at"
          defaultValue={scheduledDefault}
          className="w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
        <span className="text-xs text-muted">
          Leave blank to save as a draft you send manually later. If set, a background job checks
          for due campaigns once a day (Vercel&apos;s free plan only allows daily cron jobs) — so
          treat this as &quot;send on this day,&quot; not to-the-minute.
        </span>
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4] disabled:opacity-60"
        >
          {pending ? "Saving…" : campaign ? "Save Changes" : "Save Draft"}
        </button>
      </div>
    </form>
  );
}

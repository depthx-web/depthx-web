"use client";

import { useActionState } from "react";
import { createCampaignAction, type CampaignActionState } from "@/app/admin/actions/campaigns";

const initialState: CampaignActionState = { error: null };

export function CampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaignAction, initialState);

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
          className="w-full resize-y rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
        <span className="text-xs text-muted">
          Plain text. An unsubscribe link is appended automatically when sent.
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
          {pending ? "Saving…" : "Save Draft"}
        </button>
      </div>
    </form>
  );
}

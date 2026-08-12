"use client";

import { useActionState } from "react";
import { updateLegalPageAction, type LegalActionState } from "@/app/admin/actions/legal";

const initialState: LegalActionState = { error: null };

const inputClass =
  "w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue";

export function LegalPageForm({
  slug,
  title,
  body,
}: {
  slug: string;
  title: string;
  body: string;
}) {
  const action = updateLegalPageAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">TITLE</span>
        <input name="title" defaultValue={title} required className={inputClass} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">BODY</span>
        <textarea
          name="body"
          defaultValue={body}
          rows={24}
          className={`${inputClass} resize-y font-mono text-[13px] leading-6`}
        />
      </label>
      {state.success && (
        <p role="status" className="rounded-md border border-green bg-green/10 px-4 py-3 text-sm text-green">
          Saved successfully.
        </p>
      )}
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
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import {
  updateNewsletterInterestsAction,
  type UpdateInterestsActionState,
} from "@/app/actions/newsletter";
import { NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

const initialState: UpdateInterestsActionState = { error: null };

export function ManageForm({
  id,
  currentInterests,
}: {
  id: string;
  currentInterests: NewsletterInterest[];
}) {
  const action = updateNewsletterInterestsAction.bind(null, id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 font-mono text-[11px] tracking-wide text-muted">
          I&apos;M INTERESTED IN
        </legend>
        {NEWSLETTER_INTERESTS.map((interest) => (
          <label key={interest.value} className="flex items-center gap-2.5 text-sm leading-6">
            <input
              type="checkbox"
              name="interests"
              value={interest.value}
              defaultChecked={currentInterests.includes(interest.value)}
              className="h-4 w-4 shrink-0 accent-green"
            />
            {interest.label}
          </label>
        ))}
      </fieldset>

      {state.success && (
        <p role="status" className="text-sm text-green">
          Preferences saved.
        </p>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Preferences"}
        </button>
        <a
          href={`/api/newsletter/unsubscribe?id=${id}`}
          className="font-mono text-xs text-muted underline hover:text-text"
        >
          Unsubscribe completely
        </a>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  addSubscriberManuallyAction,
  type AddSubscriberActionState,
} from "@/app/admin/actions/newsletter";
import { NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";

const initialState: AddSubscriberActionState = { error: null };

export function AddSubscriberForm() {
  const [state, formAction, pending] = useActionState(addSubscriberManuallyAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-line bg-bg-2 p-5"
    >
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">EMAIL</span>
        <input
          type="email"
          name="email"
          required
          className="rounded-md border border-line bg-bg px-3.5 py-2.5 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
      </label>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-0.5 font-mono text-[11px] tracking-wide text-muted">
          INTERESTS (DEFAULTS TO ALL)
        </legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {NEWSLETTER_INTERESTS.map((interest) => (
            <label key={interest.value} className="flex items-center gap-1.5 text-xs text-muted">
              <input
                type="checkbox"
                name="interests"
                value={interest.value}
                defaultChecked
                className="h-3.5 w-3.5 accent-green"
              />
              {interest.label}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-green px-5 py-2.5 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97] disabled:opacity-60"
      >
        {pending ? "Adding…" : "+ Add Subscriber"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-amber">
          {state.error}
        </p>
      )}
    </form>
  );
}

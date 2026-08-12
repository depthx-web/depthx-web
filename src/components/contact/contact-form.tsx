"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ContactRole } from "@/lib/types";
import { submitContactMessageAction, type ContactActionState } from "@/app/actions/contact";

const initialState: ContactActionState = { error: null };

export function ContactForm({
  role,
  onRoleChange,
}: {
  role: ContactRole;
  onRoleChange: (role: ContactRole) => void;
}) {
  const [state, formAction, pending] = useActionState(submitContactMessageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.success) successRef.current?.focus();
  }, [state.success]);

  if (state.success) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="mt-7.5 max-w-xl rounded-lg border border-green bg-green/10 p-4.5 text-sm leading-6"
      >
        <strong className="mb-1 block font-display text-[15px] text-green">
          Message received.
        </strong>
        Thanks for reaching out — our team typically responds within 2 business days.
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-7.5 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <Field label="FULL NAME" className="sm:col-span-1">
        <input type="text" name="name" required className={inputClass} />
      </Field>
      <Field label="EMAIL" className="sm:col-span-1">
        <input type="email" name="email" required className={inputClass} />
      </Field>
      <Field label="I AM A..." className="sm:col-span-2">
        <select
          name="role"
          value={role}
          onChange={(e) => onRoleChange(e.target.value as ContactRole)}
          className={inputClass}
        >
          <option value="investor">Investor</option>
          <option value="researcher">Researcher / University</option>
          <option value="company">Company / Industrial Partner</option>
        </select>
      </Field>
      <Field label="MESSAGE" className="sm:col-span-2">
        <textarea name="message" required rows={4} className={`${inputClass} resize-y`} />
      </Field>
      {state.error && (
        <p role="alert" className="sm:col-span-2 text-sm text-amber">
          {state.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {pending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="font-mono text-[11px] tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions/auth";

const initialState: { error: string | null } = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">EMAIL</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">PASSWORD</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

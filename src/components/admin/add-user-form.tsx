"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUserAction, type CreateUserActionState } from "@/app/admin/actions/users";

const initialState: CreateUserActionState = { error: null };

export function AddUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-bg-2 p-5"
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
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">PASSWORD</span>
        <input
          type="text"
          name="password"
          required
          minLength={8}
          placeholder="min. 8 characters"
          className="rounded-md border border-line bg-bg px-3.5 py-2.5 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-wide text-muted">ROLE</span>
        <select
          name="role"
          defaultValue="editor"
          className="rounded-md border border-line bg-bg px-3.5 py-2.5 text-sm text-text"
        >
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-green px-5 py-2.5 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97] disabled:opacity-60"
      >
        {pending ? "Adding…" : "+ Add User"}
      </button>
      {state.success && (
        <p role="status" className="w-full text-sm text-green">
          User created — share the email and password with them directly.
        </p>
      )}
      {state.error && (
        <p role="alert" className="w-full text-sm text-amber">
          {state.error}
        </p>
      )}
    </form>
  );
}

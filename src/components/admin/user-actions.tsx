"use client";

import { useActionState, useState } from "react";
import {
  resetUserPasswordAction,
  deleteUserAction,
  type ResetPasswordActionState,
} from "@/app/admin/actions/users";
import { DeleteButton } from "@/components/admin/delete-button";

const initialState: ResetPasswordActionState = { error: null };

export function UserActions({
  userId,
  email,
  isSelf,
}: {
  userId: string;
  email: string;
  isSelf: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const action = resetUserPasswordAction.bind(null, userId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3 font-mono text-xs">
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="text-blue hover:text-text"
        >
          {editing ? "Cancel" : "Reset password"}
        </button>
        {!isSelf && <DeleteButton action={deleteUserAction.bind(null, userId)} label={email} />}
      </div>
      {editing && (
        <form action={formAction} className="flex items-start gap-2">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              name="password"
              required
              minLength={8}
              placeholder="min. 8 characters"
              className="rounded-md border border-line bg-bg px-3 py-1.5 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
            />
            {state.error && <span className="text-xs text-amber">{state.error}</span>}
            {state.success && <span className="text-xs text-green">Password updated.</span>}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-green px-3 py-1.5 text-xs font-semibold text-[#06140F] hover:bg-[#5EE6B4] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}

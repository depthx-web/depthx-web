"use client";

import { useActionState, useEffect, useRef } from "react";
import { replyToMessageAction, type ReplyActionState } from "@/app/admin/actions/messages";

const initialState: ReplyActionState = { error: null };

export function ReplyForm({ messageId }: { messageId: string }) {
  const action = replyToMessageAction.bind(null, messageId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2.5">
      <textarea
        name="body"
        required
        rows={3}
        placeholder="Write a reply — sent from your configured email address."
        className="w-full rounded-md border border-line bg-bg px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-5 py-2.5 text-xs font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] active:translate-y-0 active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Reply"}
        </button>
        {state.success && <span className="text-xs text-green">Reply sent.</span>}
        {state.error && (
          <span role="alert" className="text-xs text-amber">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

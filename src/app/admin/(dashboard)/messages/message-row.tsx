"use client";

import { useState } from "react";
import { deleteMessageAction, markMessageReadAction } from "@/app/admin/actions/messages";
import { ReplyForm } from "@/components/admin/reply-form";

export interface MessageRowData {
  id: string;
  name: string;
  email: string;
  role: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface MessageReplyData {
  id: string;
  message_id: string;
  body: string;
  sent_at: string;
}

export function MessageRow({
  msg,
  replies,
  canDelete,
}: {
  msg: MessageRowData;
  replies: MessageReplyData[];
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-lg border p-5 ${
        msg.read ? "border-line bg-bg-2" : "border-green/40 bg-green/5"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
      >
        <div>
          <div className="flex items-center gap-2.5">
            {!msg.read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-green" aria-label="Unread" />
            )}
            <span className="font-display text-[15px] font-semibold">{msg.name}</span>
            <span className="font-mono text-[11px] text-muted">{msg.email}</span>
            <span className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted uppercase">
              {msg.role}
            </span>
          </div>
          <p className="mt-1.5 max-w-xl truncate text-[13px] text-muted">{msg.message}</p>
        </div>
        <span className="whitespace-nowrap font-mono text-[11px] text-muted">
          {new Date(msg.created_at).toLocaleString()}
        </span>
      </button>
      {open && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-4 whitespace-pre-line text-sm leading-7 text-text">{msg.message}</p>

          {replies.length > 0 && (
            <div className="mb-4 flex flex-col gap-3 border-t border-line pt-4">
              {replies.map((reply) => (
                <div key={reply.id} className="rounded-md border border-line bg-bg px-3.5 py-3">
                  <div className="mb-1.5 font-mono text-[10.5px] text-muted">
                    You replied · {new Date(reply.sent_at).toLocaleString()}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-6.5 text-text">{reply.body}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4 border-t border-line pt-4">
            <ReplyForm messageId={msg.id} />
          </div>

          <div className="flex flex-wrap gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => markMessageReadAction(msg.id, !msg.read)}
              className="text-blue hover:text-text"
            >
              Mark as {msg.read ? "unread" : "read"}
            </button>
            <a href={`mailto:${msg.email}`} className="text-blue hover:text-text">
              Reply from my email client instead
            </a>
            {canDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this message? This can't be undone.")) {
                    deleteMessageAction(msg.id);
                  }
                }}
                className="text-amber hover:text-text"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

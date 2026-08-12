import type { Metadata } from "next";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { MessageRow } from "./message-row";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [{ data: messages }, { data: replies }] = await Promise.all([
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("message_replies").select("*").order("sent_at", { ascending: true }),
  ]);

  const repliesByMessage = new Map<string, NonNullable<typeof replies>>();
  for (const reply of replies ?? []) {
    const list = repliesByMessage.get(reply.message_id) ?? [];
    list.push(reply);
    repliesByMessage.set(reply.message_id, list);
  }

  const unreadCount = (messages ?? []).filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">
        Messages{" "}
        {unreadCount > 0 && (
          <span className="ml-1 rounded-full bg-green px-2.5 py-0.5 align-middle font-mono text-xs text-[#06140F]">
            {unreadCount} new
          </span>
        )}
      </h1>
      <p className="mb-8 text-sm text-muted">Submissions from the public Contact form.</p>
      <div className="flex flex-col gap-3">
        {(messages ?? []).length === 0 && (
          <p className="text-sm text-muted">No messages yet.</p>
        )}
        {(messages ?? []).map((m) => (
          <MessageRow
            key={m.id}
            msg={m}
            replies={repliesByMessage.get(m.id) ?? []}
            canDelete={profile.role === "admin"}
          />
        ))}
      </div>
    </div>
  );
}

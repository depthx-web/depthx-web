"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";

export type ReplyActionState = { error: string | null; success?: boolean };

export async function replyToMessageAction(
  messageId: string,
  _prevState: ReplyActionState,
  formData: FormData,
): Promise<ReplyActionState> {
  const profile = await requireProfile();
  const body = String(formData.get("body") || "").trim();
  if (!body) return { error: "Write a reply before sending." };

  const supabase = await createClient();
  const { data: message } = await supabase
    .from("contact_messages")
    .select("email, name")
    .eq("id", messageId)
    .single();
  if (!message) return { error: "Message not found." };

  const result = await sendEmail({
    to: message.email,
    subject: "Re: your message to Depth X",
    text: body,
  });
  if (!result.ok) return { error: result.error };

  const { error } = await supabase
    .from("message_replies")
    .insert({ message_id: messageId, body, sent_by: profile.id });
  if (error) return { error: error.message };

  await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);

  revalidatePath("/admin/messages");
  return { error: null, success: true };
}

export async function markMessageReadAction(id: string, read: boolean) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

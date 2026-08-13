"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { getSiteSettings } from "@/lib/content";
import { sendEmail } from "@/lib/email/send";
import { SITE_URL } from "@/lib/site";

export type ContactActionState = { error: string | null; success?: boolean };

export async function submitContactMessageAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "other");
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email, and message." };
  }

  if (!hasSupabaseConfig) {
    // No CMS connected yet — accept the submission client-side only so the
    // form still demonstrates working UX. See README "Connecting the real CMS".
    return { error: null, success: true };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, role, message });
  if (error) return { error: "Something went wrong sending your message. Please try again." };

  // Best-effort staff notification — the message is already saved regardless
  // of whether this succeeds, so a delivery failure here isn't reported to
  // the visitor as a submission failure.
  const settings = await getSiteSettings();
  const notifyAddress =
    settings.contactEmails[role as keyof typeof settings.contactEmails] ??
    settings.contactEmails.company;
  if (notifyAddress) {
    await sendEmail({
      to: notifyAddress,
      subject: `New contact message from ${name} (${role})`,
      text: [
        `${name} <${email}> submitted a message via the ${role} contact form.`,
        "",
        message,
        "",
        `Reply from the admin panel: ${SITE_URL}/admin/messages`,
      ].join("\n"),
    });
  }

  return { error: null, success: true };
}

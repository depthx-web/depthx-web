"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";

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

  return { error: null, success: true };
}

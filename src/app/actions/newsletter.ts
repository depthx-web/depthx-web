"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export type NewsletterActionState = { error: string | null; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletterAction(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = String(formData.get("email") || "").trim();

  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!hasSupabaseConfig) {
    return { error: null, success: true };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    // Unique-constraint violation just means they're already on the list —
    // treat that as a success from the visitor's point of view.
    if (error.code === "23505") return { error: null, success: true };
    return { error: "Something went wrong subscribing. Please try again." };
  }

  return { error: null, success: true };
}

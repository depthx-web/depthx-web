"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { sendEmail } from "@/lib/email/send";
import { appendEmailFooter } from "@/lib/email/template";
import { SITE_URL } from "@/lib/site";

export type NewsletterActionState = { error: string | null; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WELCOME_BODY = `Thanks for subscribing to Depth X updates.

You'll hear from us occasionally when there's something worth sharing — a patent granted, a new research domain, or a licensing opportunity opening up. No spam, no noise.`;

export async function subscribeNewsletterAction(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const email = String(formData.get("email") || "").trim();
  const consent = formData.get("consent") === "on";

  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!consent) {
    return { error: "Please confirm you'd like to receive marketing emails from us." };
  }

  if (!hasSupabaseConfig) {
    return { error: null, success: true };
  }

  // Generate the id ourselves rather than using .select() to read it back
  // after insert: the anon role only has INSERT permission on this table
  // (no SELECT — otherwise the whole subscriber list would be readable
  // with the public API key), and an INSERT...RETURNING still needs a
  // passing SELECT policy to return the row, so .select() here would fail
  // under RLS even though the insert itself succeeds.
  const id = crypto.randomUUID();
  const supabase = createPublicClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ id, email });

  if (error) {
    // Unique-constraint violation just means they're already on the list —
    // treat that as a success from the visitor's point of view, and don't
    // re-send the welcome email for an existing subscriber.
    if (error.code === "23505") return { error: null, success: true };
    return { error: "Something went wrong subscribing. Please try again." };
  }

  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${id}`;
  await sendEmail({
    to: email,
    subject: "Welcome to Depth X updates",
    text: appendEmailFooter(WELCOME_BODY, { unsubscribeUrl }),
  });

  return { error: null, success: true };
}

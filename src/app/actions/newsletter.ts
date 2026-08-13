"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { createAdminClient, hasServiceRoleConfig } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { appendEmailFooter } from "@/lib/email/template";
import { SITE_URL } from "@/lib/site";
import { ALL_NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

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
  const requestedInterests = formData.getAll("interests") as NewsletterInterest[];
  const interests = requestedInterests.filter((i) => ALL_NEWSLETTER_INTERESTS.includes(i));
  if (interests.length === 0) interests.push(...ALL_NEWSLETTER_INTERESTS);

  const id = crypto.randomUUID();
  const supabase = createPublicClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ id, email, interests });

  if (error) {
    // Unique-constraint violation just means they're already on the list —
    // treat that as a success from the visitor's point of view, and don't
    // re-send the welcome email for an existing subscriber.
    if (error.code === "23505") return { error: null, success: true };
    return { error: "Something went wrong subscribing. Please try again." };
  }

  const manageUrl = `${SITE_URL}/newsletter/manage?id=${id}`;
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${id}`;
  await sendEmail({
    to: email,
    subject: "Welcome to Depth X updates",
    text: appendEmailFooter(
      `${WELCOME_BODY}\n\nManage what you hear about any time: ${manageUrl}`,
      { unsubscribeUrl },
    ),
  });

  return { error: null, success: true };
}

export type UpdateInterestsActionState = { error: string | null; success?: boolean };

/**
 * Self-service preference update, reached from the manage-subscription link
 * in every marketing email. Uses the service-role client rather than a
 * public RLS policy — same reasoning as the unsubscribe route: there's no
 * public SELECT on this table (it would let anyone dump the subscriber
 * list via the anon key), so reading/writing a specific row by its
 * unguessable id has to go through the trusted server-only client instead.
 */
export async function updateNewsletterInterestsAction(
  id: string,
  _prevState: UpdateInterestsActionState,
  formData: FormData,
): Promise<UpdateInterestsActionState> {
  if (!hasServiceRoleConfig) {
    return { error: "Managing preferences isn't configured yet. Please try again later." };
  }

  const requestedInterests = formData.getAll("interests") as NewsletterInterest[];
  const interests = requestedInterests.filter((i) => ALL_NEWSLETTER_INTERESTS.includes(i));
  if (interests.length === 0) {
    return { error: "Choose at least one topic, or use the unsubscribe link instead." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("newsletter_subscribers").update({ interests }).eq("id", id);
  if (error) return { error: "Something went wrong saving your preferences. Please try again." };

  return { error: null, success: true };
}

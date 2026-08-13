"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { ALL_NEWSLETTER_INTERESTS } from "@/lib/newsletter-interests";
import type { NewsletterInterest } from "@/lib/supabase/database.types";

export async function deleteSubscriberAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}

export type AddSubscriberActionState = { error: string | null; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Admin-side manual add — bypasses the public form's consent checkbox
 * since this is the admin directly adding a known contact, not the visitor
 * self-subscribing. */
export async function addSubscriberManuallyAction(
  _prevState: AddSubscriberActionState,
  formData: FormData,
): Promise<AddSubscriberActionState> {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  const requested = formData.getAll("interests") as NewsletterInterest[];
  const interests = requested.filter((i) => ALL_NEWSLETTER_INTERESTS.includes(i));
  if (interests.length === 0) interests.push(...ALL_NEWSLETTER_INTERESTS);

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ id: crypto.randomUUID(), email, interests });

  if (error) {
    if (error.code === "23505") return { error: "That email is already subscribed." };
    return { error: "Something went wrong adding that subscriber." };
  }

  revalidatePath("/admin/newsletter");
  return { error: null, success: true };
}

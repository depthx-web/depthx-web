"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export type LegalActionState = { error: string | null; success?: boolean };

export async function updateLegalPageAction(
  slug: string,
  _prevState: LegalActionState,
  formData: FormData,
): Promise<LegalActionState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "");
  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("legal_pages")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) return { error: error.message };

  revalidatePath(`/admin/legal/${slug}`);
  revalidatePath(`/legal/${slug}`);
  return { error: null, success: true };
}

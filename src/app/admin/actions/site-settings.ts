"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { SECTION_KEYS } from "@/lib/section-visibility";

export type SiteSettingsActionState = { error: string | null; success?: boolean };

export async function updateSiteSettingsAction(
  _prevState: SiteSettingsActionState,
  formData: FormData,
): Promise<SiteSettingsActionState> {
  await requireAdmin();

  const stats = [1, 2, 3, 4].map((n) => ({
    label: String(formData.get(`stat_${n}_label`) || ""),
    value: String(formData.get(`stat_${n}_value`) || ""),
  }));

  const trustBarLogos = [1, 2, 3, 4, 5, 6]
    .map((n) => ({
      name: String(formData.get(`trust_bar_logo_${n}_name`) || "").trim(),
      logoUrl: String(formData.get(`trust_bar_logo_${n}_url`) || "").trim() || undefined,
    }))
    .filter((logo) => logo.name);

  const sectionVisibility = Object.fromEntries(
    SECTION_KEYS.map((key) => [key, formData.get(`section_${key}`) === "on"]),
  );

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_headline: String(formData.get("hero_headline") || ""),
      hero_headline_accent: String(formData.get("hero_headline_accent") || ""),
      hero_subtext: String(formData.get("hero_subtext") || ""),
      logo_url: String(formData.get("logo_url") || "").trim() || null,
      footer_text: String(formData.get("footer_text") || ""),
      contact_email_investor: String(formData.get("contact_email_investor") || ""),
      contact_email_researcher: String(formData.get("contact_email_researcher") || ""),
      contact_email_company: String(formData.get("contact_email_company") || ""),
      stats,
      trust_bar_logos: trustBarLogos,
      section_visibility: sectionVisibility,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  // Site settings feed almost every page (nav, footer, home).
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

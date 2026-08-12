import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "./site-settings-form";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SiteSettingsPage() {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/admin");

  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  if (!settings) {
    return <p className="text-sm text-amber">Could not load site settings.</p>;
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Site Settings</h1>
      <p className="mb-8 text-sm text-muted">
        Global copy, stats, and section visibility (spec §5) — admin-only.
      </p>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}

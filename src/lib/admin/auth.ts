import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

export interface AdminProfile {
  id: string;
  email: string;
  role: UserRole;
}

/** Server Component/Action helper. Returns null if not logged in. */
export async function getCurrentProfile(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .single();

  return profile;
}

/** Use at the top of any admin page/action. Redirects to login if not authenticated. */
export async function requireProfile(): Promise<AdminProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  return profile;
}

/**
 * Use for admin-only actions (site settings, user roles). RLS enforces this
 * at the database layer regardless — this is just so the UI fails clearly
 * instead of silently no-op-ing on a blocked write.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const profile = await requireProfile();
  if (profile.role !== "admin") {
    throw new Error("This action requires the admin role.");
  }
  return profile;
}

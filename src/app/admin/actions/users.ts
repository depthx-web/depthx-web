"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRoleConfig } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/supabase/database.types";

export async function updateUserRoleAction(userId: string, formData: FormData) {
  await requireAdmin();
  const role = formData.get("role") as UserRole;

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export type CreateUserActionState = { error: string | null; success?: boolean };

export async function createUserAction(
  _prevState: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  await requireAdmin();

  if (!hasServiceRoleConfig) {
    return {
      error: "Adding users isn't configured yet — SUPABASE_SERVICE_ROLE_KEY is missing.",
    };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = formData.get("role") as UserRole;

  if (!email || !email.includes("@")) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (role !== "admin" && role !== "editor") return { error: "Choose a role." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return { error: error.message };

  // handle_new_user (supabase/migrations/0001_init.sql) already inserted a
  // profiles row defaulting to 'editor' — only need to update it if 'admin'
  // was requested.
  if (role === "admin" && data.user) {
    const supabase = await createClient();
    await supabase.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  }

  revalidatePath("/admin/users");
  return { error: null, success: true };
}

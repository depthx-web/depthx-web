import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { RoleSelect } from "@/components/admin/role-select";

export const metadata: Metadata = { title: "Users & Roles" };

export default async function UsersPage() {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/admin");

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Users & Roles</h1>
      <p className="mb-8 text-sm text-muted">
        Admins can edit content and Site Settings. Editors can edit content only (spec §6).
      </p>
      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-2">
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Email</th>
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Joined</th>
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Role</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3">
                  {p.email} {p.id === profile.id && <span className="text-muted">(you)</span>}
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <RoleSelect userId={p.id} role={p.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

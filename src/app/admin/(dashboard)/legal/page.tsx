import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Legal Pages" };

export default async function LegalPagesListPage() {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/admin");

  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("legal_pages")
    .select("*")
    .order("title", { ascending: true });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Legal Pages</h1>
      <p className="mb-8 text-sm text-muted">
        Editable pages linked from the site footer. Admin-only — worth having a solicitor review
        before publishing changes.
      </p>
      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-2">
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Title</th>
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Slug</th>
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(pages ?? []).map((p) => (
              <tr key={p.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.slug}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(p.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/legal/${p.slug}`} className="font-mono text-xs text-blue hover:text-text">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

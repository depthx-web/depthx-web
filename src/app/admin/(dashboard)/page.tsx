import type { Metadata } from "next";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { RESOURCE_CONFIGS } from "@/lib/admin/resource-config";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const profile = await requireProfile();
  const supabase = (await createClient()) as unknown as SupabaseClient;

  const counts = await Promise.all(
    RESOURCE_CONFIGS.map(async (r) => {
      const { count } = await supabase.from(r.table).select("*", { count: "exact", head: true });
      return { slug: r.slug, label: r.label, count: count ?? 0 };
    }),
  );

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Welcome, {profile.email}</h1>
      <p className="mb-8 text-sm text-muted">
        Signed in as <span className="text-text">{profile.role}</span>. Pick a content type to
        edit below.
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {counts.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/${c.slug}`}
            className="rounded-xl border border-line bg-bg-2 p-5 hover:border-line-2"
          >
            <div className="font-display text-3xl font-bold text-green">{c.count}</div>
            <div className="mt-1 font-mono text-xs text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

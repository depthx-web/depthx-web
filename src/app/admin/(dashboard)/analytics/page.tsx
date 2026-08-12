import type { Metadata } from "next";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { BarList } from "./bar-list";

export const metadata: Metadata = { title: "Analytics" };

// Supabase's JS client has no GROUP BY — fine at this scale (page_views is a
// lightweight counter, not a full analytics warehouse). Fetch the last 30
// days bounded to 5,000 rows and aggregate in memory. If traffic outgrows
// this, swap to a Postgres view/RPC, or to Plausible/GA4 (already scaffolded
// in src/components/analytics.tsx).
const WINDOW_ROW_LIMIT = 5000;

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function topEntries(rows: { path?: string; country?: string }[], key: "path" | "country", limit: number) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[key] || "Unknown";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export default async function AnalyticsPage() {
  await requireProfile();
  const supabase = await createClient();

  const [{ count: totalCount }, { count: last7Count }, { count: last30Count }, { data: last30Rows }] =
    await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgoISO(7)),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", daysAgoISO(30)),
      supabase
        .from("page_views")
        .select("path, country")
        .gte("created_at", daysAgoISO(30))
        .limit(WINDOW_ROW_LIMIT),
    ]);

  const rows = last30Rows ?? [];
  const topPages = topEntries(rows, "path", 8);
  const topCountries = topEntries(rows, "country", 8);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Analytics</h1>
      <p className="mb-8 text-sm text-muted">
        Self-hosted pageview counter — no cookies, no cross-session tracking.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Visits (all time)" value={totalCount ?? 0} />
        <StatTile label="Last 7 Days" value={last7Count ?? 0} />
        <StatTile label="Last 30 Days" value={last30Count ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-bg-2 p-6">
          <h2 className="mb-4 font-display text-base font-semibold">Top Pages (30 days)</h2>
          {topPages.length ? (
            <BarList items={topPages} />
          ) : (
            <p className="text-sm text-muted">No visits recorded yet.</p>
          )}
        </div>
        <div className="rounded-xl border border-line bg-bg-2 p-6">
          <h2 className="mb-4 font-display text-base font-semibold">Top Countries (30 days)</h2>
          {topCountries.length ? (
            <BarList items={topCountries} />
          ) : (
            <p className="text-sm text-muted">No visits recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-bg-2 p-6">
      <div className="font-display text-3xl font-bold text-green">{value.toLocaleString()}</div>
      <div className="mt-1 font-mono text-xs text-muted">{label}</div>
    </div>
  );
}

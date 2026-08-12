import type { Metadata } from "next";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSubscriberAction } from "@/app/admin/actions/newsletter";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Newsletter" };

export default async function NewsletterPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = subscribers ?? [];

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">
          Newsletter{" "}
          <span className="ml-1 align-middle font-mono text-sm font-normal text-muted">
            {rows.length} subscriber{rows.length === 1 ? "" : "s"}
          </span>
        </h1>
        {rows.length > 0 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- triggers a CSV file download, not a page navigation
          <a
            href="/admin/newsletter/export"
            className="rounded-md border border-line px-4 py-2 font-mono text-xs transition-all duration-150 hover:border-blue hover:bg-blue/10 active:scale-95"
          >
            Download CSV
          </a>
        )}
      </div>
      <p className="mb-8 text-sm text-muted">
        Signups from the homepage newsletter form. Download the CSV to import into your email
        sending tool of choice.
      </p>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-2">
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">Email</th>
              <th className="px-4 py-3 text-left font-mono text-[11px] text-muted">
                Subscribed
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  No subscribers yet.
                </td>
              </tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-none hover:bg-hover">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {new Date(s.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {profile.role === "admin" && (
                    <DeleteButton
                      action={deleteSubscriberAction.bind(null, s.id)}
                      label={s.email}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const csv = ["email,subscribed_at", ...rows.map((r) => `${r.email},${r.created_at}`)].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="depthx-newsletter-subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}

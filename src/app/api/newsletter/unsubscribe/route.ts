import { NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient, hasServiceRoleConfig } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { sendEmail } from "@/lib/email/send";
import { appendEmailFooter } from "@/lib/email/template";

const FAREWELL_BODY = `You've been unsubscribed from Depth X updates and won't receive further marketing emails from us.

If that was a mistake, you're welcome to subscribe again any time from our homepage.`;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (id && hasSupabaseConfig) {
    // The anon key only has INSERT/DELETE-by-id on this table, not SELECT
    // (otherwise the whole subscriber list would be readable via the public
    // API key) — but DELETE...RETURNING still needs a passing SELECT policy
    // to hand the row back, so reading the email back needs the
    // service-role client, which legitimately bypasses RLS for this
    // trusted, server-only route.
    if (hasServiceRoleConfig) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id)
        .select("email")
        .single();

      // Transactional confirmation, not marketing — no unsubscribe link
      // needed (they just used it), so no PECR marketing paragraph here.
      if (data?.email) {
        await sendEmail({
          to: data.email,
          subject: "You've been unsubscribed",
          text: appendEmailFooter(FAREWELL_BODY),
        });
      }
    } else {
      // No service role configured — still honor the unsubscribe, just
      // without a farewell email (can't read the email back to send one).
      const supabase = createPublicClient();
      await supabase.from("newsletter_subscribers").delete().eq("id", id);
    }
  }

  return new Response(unsubscribePageHtml(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function unsubscribePageHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Unsubscribed — Depth X</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { font-family: system-ui, sans-serif; background: #0a1220; color: #e8edf4; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
  a { color: #3ed6a0; }
</style>
</head>
<body>
  <div>
    <h1 style="font-size: 20px;">You've been unsubscribed.</h1>
    <p style="color: #8ca0b8;">You won't receive further emails from the Depth X newsletter. <a href="/">Return to the site</a>.</p>
  </div>
</body>
</html>`;
}

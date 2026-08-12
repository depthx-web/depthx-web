import { NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (id && hasSupabaseConfig) {
    const supabase = createPublicClient();
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
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

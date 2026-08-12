export function SupabaseNotConnected() {
  return (
    <div className="mx-auto max-w-xl px-8 py-40 text-center">
      <h1 className="mb-4 font-display text-2xl font-semibold">Admin Panel not connected yet</h1>
      <p className="mb-2 text-sm leading-7 text-muted">
        This route needs a Supabase project. Create one at{" "}
        <a href="https://supabase.com/dashboard" className="text-blue hover:text-text">
          supabase.com/dashboard
        </a>
        , run the SQL in <code className="text-amber">supabase/migrations/0001_init.sql</code>,
        and set <code className="text-amber">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-amber">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in{" "}
        <code className="text-amber">.env.local</code>.
      </p>
      <p className="text-sm leading-7 text-muted">
        See README.md &quot;Connecting the real CMS&quot; for the full steps.
      </p>
    </div>
  );
}

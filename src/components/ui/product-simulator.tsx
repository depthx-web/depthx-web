/**
 * Renders admin-supplied HTML in a sandboxed iframe. `sandbox="allow-scripts"`
 * (deliberately WITHOUT `allow-same-origin`) puts the embedded content in a
 * unique opaque origin: it can run its own JS, but has no access to this
 * site's cookies, DOM, localStorage, or the logged-in admin's session —
 * even if someone with editor access pastes something malicious, it can't
 * affect the rest of the site or other visitors' sessions.
 */
export function ProductSimulator({ html }: { html: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-2">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-mono text-[11px] text-muted">
        <span className="h-2 w-2 rounded-full bg-green" />
        PRODUCT SIMULATOR — INTERACTIVE DEMO
      </div>
      <iframe
        title="Product simulator"
        srcDoc={html}
        sandbox="allow-scripts allow-forms"
        className="h-125 w-full border-0 bg-white"
      />
    </div>
  );
}

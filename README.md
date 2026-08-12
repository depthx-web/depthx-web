# Depth X — Website Rebuild

Next.js 16 (App Router) + Tailwind v4 + Supabase (Postgres + Auth), built
against the technical spec in `../depthx-site (1).html`'s handoff doc.

## Status: connected to a live Supabase project

The CMS backend is Supabase, not the Sanity option the spec originally
proposed — a deliberate later change, with a custom-built Admin Panel UI on
top (Supabase has no built-in editorial Studio the way Sanity does). The
project is connected to a live Supabase project (schema + seed data applied,
first admin user created) — see `.env.local` for the current credentials.

What's here:

- Next.js App Router project, TypeScript, Tailwind v4, ESLint — all clean
  (`npm run build`, `npm run lint`, `tsc --noEmit` all pass).
- Design tokens (colors, fonts) ported from the HTML prototype into
  `src/app/globals.css` as Tailwind v4 `@theme` variables, verified against
  the prototype pixel-for-pixel on every page via Playwright screenshot
  diffs.
- Every public route from spec §3 — Home, Projects (+ detail), Investors,
  Research, IP & Patents, Publications, Team, News, Collaboration, Contact.
- A **custom Admin Panel** at `/admin` (spec §6): email/password login,
  role-gated access (admin vs. editor, spec §6), a config-driven CRUD UI
  that covers every content type in spec §4, and a dedicated Site Settings
  editor with the full section-visibility grid (spec §5). See "Admin Panel"
  below.
- A Postgres schema (`supabase/migrations/0001_init.sql`) with row-level
  security enforcing the role model at the database layer, not just in the
  UI, plus a seed file (`supabase/seed.sql`) with the same placeholder
  content already on the public site.
- A data-access layer (`src/lib/content.ts`) that queries Supabase when
  it's configured and transparently falls back to mock fixtures
  (`src/lib/mock-data/`) otherwise — the public site fully works with zero
  environment variables, and starts reading real data the moment you add
  Supabase credentials, no code changes required.
- Section visibility is live end-to-end: toggle any key in the Site
  Settings admin page (or `src/lib/mock-data/site-settings.ts` when running
  on mock data) and the corresponding section disappears from the public
  site.
- SEO: per-page metadata (title/description/canonical/OpenGraph/Twitter
  card), a generated OG image, `sitemap.xml`, `robots.txt`, and JSON-LD
  (`Organization` site-wide, `BreadcrumbList` per page).
- On-demand ISR revalidation webhook (spec §7) at
  `src/app/api/revalidate/route.ts`, shaped for Supabase's Database
  Webhooks payload — just needs a real webhook pointed at it (see
  "Connecting the real CMS").
- Analytics scaffolding (Plausible, env-gated) with a role-selection
  tracking event on the Contact toggle, per spec §7.
- Verified with a real Lighthouse run against a production build:
  **Accessibility 100, Best Practices 100, SEO 100, Performance 89**
  (Performance is measured under Lighthouse's default simulated
  mobile/slow-network throttle against an uncached local server — a real
  Vercel deployment with CDN edge caching will score higher).
- **Legal pages** (`/legal/privacy-policy`, `/legal/terms-of-service`) —
  drafted UK-GDPR-aware content for Depth X Ltd. specifically, admin-editable
  at `/admin/legal`, linked from a "Legal" footer column. **Have a solicitor
  review the drafted text before treating it as final** — it's a solid,
  genuinely-researched starting point (real company number, real registered
  address), not a substitute for legal advice.
- **Per-item SEO keywords** on every content type (spec's 8 types), editable
  in each admin form, rendered as `<meta name="keywords">` on the relevant
  public page (aggregated across items on list-style pages).
- **Contact messages persist to the database** and are readable at
  `/admin/messages` (unread badge, mark read/unread, reply-by-email link,
  admin-only delete) — see "What's still ahead" re: outbound email.
- **News posts and projects can carry images**: news posts get a featured
  image (list card + detail page + becomes the page's OG image); projects
  get an optional **HTML product simulator**, admin-pasted raw HTML/CSS/JS
  rendered in a sandboxed iframe (`sandbox="allow-scripts allow-forms"`,
  deliberately without `allow-same-origin`) on the project detail page —
  fully interactive, but isolated from the rest of the site's cookies/DOM
  even if the pasted content is untrusted or buggy.
- **Self-hosted traffic analytics** at `/admin/analytics` — total/7-day/30-day
  visit counts, top pages, top countries. No cookies, no external account
  needed; see "Notable implementation notes" for how it works and its limits.
- **A real, generated PDF portfolio summary** at `/api/portfolio-summary`
  (built with `pdf-lib` from live project data — title, domain, status,
  patent number, readiness) — the "Download PDF Summary" buttons on
  `/investors` and `/ip-patents` now produce an actual file instead of a
  dead mailto link. Automated *emailing* of that PDF as an attachment was
  scoped out (no transactional email provider is configured — see "What's
  still ahead"); both CTAs pair the download with a plain `mailto:
  office@depthx.co.uk` for anyone who'd rather ask a person directly.
- **Newsletter signup** on the homepage (admin-hideable via
  `home.newsletter`), storing emails in `newsletter_subscribers`. Manage the
  list at `/admin/newsletter` — view, delete (admin-only), or download a CSV
  to import into whatever email tool you actually send from.
- **Per-item show/hide now covers every content type**, not just Projects
  and News. Research Domains, Publications, Team Members, Testimonials, FAQ
  Items, and Partnership Types all got a `visible` column, RLS policy, and
  admin checkbox — hide any single item without deleting it.
- **Sitewide interaction polish** — hover/press feedback (lift, scale,
  shadow) on every card and CTA that previously had none (Research domain
  cards, Team cards, Collaboration partnership cards, IP status cards, stat
  tiles), a scroll-reveal animation on the homepage's major sections
  (`src/components/ui/reveal.tsx`, IntersectionObserver-based), and an
  animated underline on nav links. Respects `prefers-reduced-motion`
  throughout.
- **Dark and light mode**, toggleable site-wide (nav, mobile menu, and the
  admin panel header) via `src/components/theme-toggle.tsx`. Choice persists
  in `localStorage`; first visit falls back to the OS's `prefers-color-scheme`.
  A blocking inline script in `app/layout.tsx` applies the theme before first
  paint, so there's no flash of the wrong theme. Every color in the app is a
  CSS variable (`src/app/globals.css`), so the whole site — public pages and
  admin alike — repaints correctly with zero per-component changes; only the
  variable *values* differ between `:root` (dark) and `:root[data-theme="light"]`.
- **Email conversations and marketing campaigns** — see "Email sending"
  below for what's live vs. pending your SMTP credentials:
  - Reply to a contact message directly from `/admin/messages`; the reply is
    emailed to the sender and logged in that message's thread (outbound
    only — if they reply back, it lands in your normal inbox, not the site).
  - Compose and send one-off email campaigns to your newsletter list at
    `/admin/campaigns` (draft first, admin-only to actually send). Every
    sent campaign appends a working one-click unsubscribe link.
- **A "Latest News" section on the homepage** (the 3 most recent published
  posts), admin-hideable via `home.latestNews` like every other homepage
  block. Previously News had no homepage presence at all — only its own
  `/news` page.

## Email sending

Both features above call `src/lib/email/send.ts`, a thin wrapper around
`nodemailer` reading `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD`
/ `SMTP_FROM` from the environment (see `.env.local.example`). **This project
is currently connected to a real mailbox** (Hostinger SMTP, `office@depthx.co.uk`,
port 465/SSL) — sending a reply or a campaign sends a real email right now.

If those env vars are ever unset (a fresh clone, a different deployment
target without them configured, etc.), `hasSmtpConfig` becomes `false` and
the app degrades gracefully rather than failing silently:

- Replying to a message shows a clear inline error ("Email sending isn't
  configured yet…") instead of silently failing.
- Campaigns can still be drafted; the campaigns list shows an amber warning
  banner, and attempting to send marks the campaign **failed** (0
  recipients delivered) rather than crashing.

What's still ahead:

- **Cross-browser/device QA** on real devices (verified so far via
  Chromium/Playwright only).
- **Media Library** — image fields (team photos, news images, trust-bar
  logos) currently take a plain URL. Supabase Storage would be the natural
  next step for in-panel uploads instead of pasting a URL.
- **Two-way email threading** — the current conversation feature is
  outbound-only by design (see above). Pulling their replies back into the
  admin thread automatically would need inbound email routing (a verified
  sending domain + provider webhook), which is a meaningfully bigger piece
  of infrastructure than what's built here.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public site runs
fully on mock data with no environment variables required. Visiting `/admin`
without Supabase configured shows a setup-instructions page instead of
crashing.

- `npm run build` — production build (also type-checks)
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type-check only

## Project structure

```
src/
  app/                 routes (one folder per URL in spec §3)
    admin/
      login/            email/password login (public)
      (dashboard)/       auth-gated shell — [resource]/, site-settings/, users/
      actions/           Server Actions: auth, generic CRUD, site settings, users
    sitemap.ts / robots.ts / opengraph-image.tsx / api/revalidate/
  components/
    admin/               ResourceTable, ResourceForm, breadcrumbs, role select, etc.
    contact/, ui/         public-site components
  lib/
    types.ts             content types (camelCase) — the shape every page consumes
    content.ts           data layer: Supabase when configured, else mock-data/
    supabase/
      client.ts           browser client
      server.ts           server client (Server Components/Actions)
      proxy.ts             session refresh + /admin auth gate (used by src/proxy.ts)
      database.types.ts    hand-written Database type (regenerate via Supabase CLI once live)
      env.ts               reads NEXT_PUBLIC_SUPABASE_* env vars
    admin/
      resource-config.ts   the CRUD registry — one entry per content type
      auth.ts              requireProfile() / requireAdmin() — role checks
      reference-options.ts  resolves FK dropdown options (e.g. project -> research domain)
    section-visibility.ts  spec §5 — section keys + visibility check
    mock-data/            fixtures, one file per content type
supabase/
  migrations/0001_init.sql  full schema + RLS policies
  migrations/0002_content_extensions.sql  keywords, images, simulator_html, legal_pages, contact_messages, page_views
  migrations/0003_visibility_and_newsletter.sql  per-item visible column (6 more tables) + newsletter_subscribers
  migrations/0004_email_conversations_and_campaigns.sql  message_replies + email_campaigns
  migrations/0005_newsletter_unsubscribe.sql  public delete-by-id policy for self-service unsubscribe
  seed.sql                   placeholder content matching lib/mock-data/
src/proxy.ts             Next.js 16's renamed middleware.ts — gates /admin/**
```

## Admin Panel

Visit `/admin`. Every content type in spec §4 (Projects, Research Domains,
Publications, Team Members, News Posts, Testimonials, FAQ Items,
Partnership Types) gets list + create + edit + delete for free from one
config-driven system — see `src/lib/admin/resource-config.ts`. **To add a
new content type**, add a table to a new migration and one entry to that
file (table name, form fields, list columns); no new pages or Server
Actions are needed.

Two roles (spec §6), enforced by Postgres RLS in `0001_init.sql` — not just
checked in the UI, so a bug in a page component can't accidentally expose a
write:

- **editor** — full CRUD on every content table.
- **admin** — everything an editor can do, plus Site Settings
  (`/admin/site-settings`, including the section-visibility grid) and user
  role management (`/admin/users`).

New signups default to `editor` (via a Postgres trigger, see "Connecting
the real CMS" step 4) — promote the first user to `admin` manually.

Beyond the content CRUD, the panel also has: **Messages** (contact form
inbox with reply-by-email, any signed-in user), **Newsletter** (subscriber
list, CSV export, any signed-in user) and **Campaigns** (compose for any
signed-in user, send is admin-only), **Analytics** (traffic dashboard, any
signed-in user), and admin-only **Legal Pages** (Privacy Policy / Terms of
Service editor) and **Users & Roles**.

## Connecting the real CMS

The app currently reads from `src/lib/mock-data/` via `src/lib/content.ts`.
To connect a real Supabase project:

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In the SQL Editor, run `supabase/migrations/0001_init.sql`, then
   optionally `supabase/seed.sql` to start with the same placeholder
   content already on the site.
3. Copy `.env.local.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   (Project Settings -> API — Supabase labels these "Project URL" and
   "anon" / "publishable" key interchangeably depending on project age).
4. Create your first user: Authentication -> Add User in the Supabase
   dashboard (or sign up via `/admin/login` if you add a signup flow later).
   The `handle_new_user` trigger gives them a `profiles` row with role
   `editor` automatically — in the SQL Editor, run
   `update profiles set role = 'admin' where email = 'you@example.com';`
   to promote yourself.
5. Run `npm run dev` and visit `/admin` — sign in and you're editing real
   data immediately. The public site (same `npm run dev`) starts reading
   the same data with no further changes.
6. For on-demand ISR (spec §7), the webhook route already exists at
   `src/app/api/revalidate/route.ts`. In the Supabase dashboard, go to
   Database -> Webhooks and add one per table you want to trigger
   revalidation (`projects`, `news_posts`, etc. — see `PATHS_BY_TABLE` in
   that file), POSTing to `https://<your-domain>/api/revalidate` with an
   HTTP header `x-webhook-secret: <SUPABASE_REVALIDATE_SECRET>` (set the
   same value in your env vars).
7. Optional: regenerate `src/lib/supabase/database.types.ts` from the live
   schema instead of the hand-written version:
   `npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts`

## Section visibility

Every togglable section (spec §5) is keyed in
`src/lib/section-visibility.ts` (`SECTION_KEYS`). A section checks
visibility with `isSectionVisible(settings.sectionVisibility, 'home.trustBar')`
in Server Components (most of the app), or the `useSectionVisible(key)` hook
in Client Components (via `SectionVisibilityProvider`, already wrapping the
whole app in `app/layout.tsx`).

To add a new togglable section: add one entry to `SECTION_KEYS`
(`src/lib/section-visibility.ts`), gate the JSX with `isSectionVisible(...)`,
and it appears automatically as a checkbox on `/admin/site-settings` — no
other changes needed. (The site_settings.section_visibility column is a
`jsonb` map, so no migration is needed either — the admin form writes
whatever keys `SECTION_KEYS` currently lists.)

## SEO & analytics

- **Metadata:** every page sets title/description/canonical/OG/Twitter tags
  via `src/lib/page-metadata.ts`. Next.js metadata merging between a layout
  and a page is *shallow* — a page that sets its own `openGraph` or
  `twitter` object fully replaces the parent's rather than merging field by
  field — so that helper re-declares the shared OG image and card type on
  every page rather than relying on inheritance from the root layout. If
  you add a new page, use `pageMetadata({ title, description, path })`
  rather than a bare `{ title }` object.
- **OG image:** generated at request time from `src/app/opengraph-image.tsx`
  (`next/og`, brand colors, no external font loading).
- **Sitemap/robots:** `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js
  file conventions). `/admin` is disallowed in robots.txt.
- **Structured data:** `Organization` JSON-LD in the root layout,
  `BreadcrumbList` JSON-LD emitted automatically by the shared
  `<Breadcrumb>` component — every page that renders a breadcrumb gets it
  for free.
- **Analytics:** set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to enable Plausible
  (`src/components/analytics.tsx`); unset, it's a no-op. Call
  `trackEvent(name, props)` from `src/lib/analytics.ts` anywhere — it's
  already wired to fire `"Role Selected"` on the Investor/Researcher/Company
  toggle (spec §7).
- Set `NEXT_PUBLIC_SITE_URL` before deploying — it's the base for canonical
  URLs, the sitemap, and `metadataBase`.

## Deploying

Framework is zero-config on [Vercel](https://vercel.com/new). Set the env
vars from `.env.local.example` in the Vercel project settings. `/admin`
ships as part of the same deployment and is protected by `src/proxy.ts`
regardless of domain — no separate hosting needed.

## Notable implementation notes

- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** (`export function
  proxy(...)`, not `middleware(...)`). `src/proxy.ts` is that file, not a
  stray leftover — confirmed against the bundled Next.js docs
  (`node_modules/next/dist/docs/`) since this is newer than most training
  data and easy to mistake for a mistake.
- **Supabase's `Database` generic type has real structural requirements**
  that a hand-written version can silently fail: every table needs
  `Row`/`Insert`/`Update`/`Relationships`, and the schema itself needs
  `Tables`/`Views`/`Functions`. Miss any of them and TypeScript doesn't
  error where you'd expect — every `.from(...)` call downstream just
  quietly resolves to `never`. See `src/lib/supabase/database.types.ts`
  for the corrected shape; regenerate from a live project when you have one
  (step 7 above) rather than maintaining this by hand long-term.
- **Generic CRUD trades some type safety for genericity on purpose.** The
  config-driven admin (`resource-config.ts` + `actions/resource.ts`) picks
  its Supabase table at runtime from a slug, which can't satisfy
  `Database['public']['Tables']`'s literal-key requirement for full
  inference — those specific call sites intentionally drop to an untyped
  `SupabaseClient`. `src/lib/content.ts` (the public read path) uses
  literal table names and keeps full typing throughout.
- **Next.js 16 / Cache Components:** this project intentionally does **not**
  enable `cacheComponents` (the new `"use cache"` directive model). It uses
  the standard fetch-cache + `revalidatePath` model, which is simpler to
  reason about for a CMS-driven marketing site and matches what spec §7
  describes (webhook-triggered ISR revalidation).
- **tsconfig `"types": ["node"]`:** without this, `tsc` auto-scans every
  `node_modules/@types/*` folder and a few nested ones are broken as
  installed, causing spurious `TS2688` errors unrelated to this project's
  code. Scoping `types` to just `["node"]` is the standard fix.
- **`next.config.ts` `turbopack.root`:** pinned explicitly because a
  `package.json` in the parent `C:\Users\marwen` directory was confusing
  Next's workspace-root auto-detection.
- **Analytics is a real, minimal pageview counter, not a full analytics
  product.** `src/components/page-tracker.tsx` beacons `path` to
  `POST /api/track` on every navigation (skipped under `/admin`); the route
  resolves country from platform geo headers (Vercel/Cloudflare) or falls
  back to a keyless lookup against `ip-api.com` (rate-limited to ~45
  req/min per outbound IP — fine to start, not for high traffic). No
  cookies, no per-visitor identity. `/admin/analytics` aggregates the last
  30 days in memory (Supabase's JS client has no `GROUP BY`) — swap to a
  Postgres view/RPC or to Plausible (already scaffolded) if this outgrows
  a getting-started tool.
- **The theme toggle reads its state via `useSyncExternalStore`, not
  `useState` + `useEffect`.** The current theme lives outside React (a
  `data-theme` attribute on `<html>`, set by the blocking script or a prior
  toggle click), so `theme-toggle.tsx` treats it as external state — subscribe
  via a `MutationObserver`, read via `getSnapshot`, and a `getServerSnapshot`
  of `"dark"` that matches what the server always renders. This is exactly
  what `useSyncExternalStore` exists for, and it avoids the
  render-then-immediately-setState-in-an-effect pattern the project's ESLint
  config (`react-hooks/set-state-in-effect`) flags as an anti-pattern.
- **`newsletter_subscribers` allows public `delete`, not just `insert`.**
  The one-click unsubscribe link in campaign emails calls
  `/api/newsletter/unsubscribe?id=<uuid>` with the anon key — there's no
  Supabase service-role key configured in this project, so an authenticated
  server-side delete isn't available for a route with no logged-in admin
  behind it. A subscriber's row id is treated as a capability token: it's an
  unguessable uuid that only that person's inbox ever receives, so allowing
  delete-by-exact-id for anon is a deliberate, low-risk trade-off (see
  `migrations/0005_newsletter_unsubscribe.sql`), not an oversight.
- **The portfolio-summary PDF is generated with `pdf-lib`, not
  `@react-pdf/renderer`.** For a single fixed-layout page (title + a table),
  drawing text/lines directly with `pdf-lib` avoids pulling in a React PDF
  renderer's font/flexbox-emulation layer for something this simple — see
  `src/app/api/portfolio-summary/route.ts`.
- **The HTML product simulator is a genuine, deliberate security boundary,
  not decoration.** Both `admin` and `editor` roles can edit `projects`, so
  a lower-trust editor could paste something malicious into
  `simulator_html`. Rendering it via `<iframe sandbox="allow-scripts
  allow-forms" srcDoc={html}>` — critically, *without* `allow-same-origin`
  — puts the embed in a unique opaque origin with no access to this site's
  cookies, DOM, or the logged-in admin's session, regardless of what the
  pasted HTML tries to do.

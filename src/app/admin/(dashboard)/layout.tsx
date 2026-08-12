import Link from "next/link";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { SupabaseNotConnected } from "@/components/admin/not-connected";
import { requireProfile } from "@/lib/admin/auth";
import { RESOURCE_CONFIGS } from "@/lib/admin/resource-config";
import { logoutAction } from "@/app/admin/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseConfig) return <SupabaseNotConnected />;

  const profile = await requireProfile();

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b border-line px-6 py-3.5">
        <Link href="/admin" className="font-display text-base font-bold">
          Depth<span className="text-amber">X</span>{" "}
          <span className="font-mono text-xs font-normal text-muted">Admin</span>
        </Link>
        <div className="flex items-center gap-4 font-mono text-xs text-muted">
          <ThemeToggle />
          <span>
            {profile.email} ·{" "}
            <span className={profile.role === "admin" ? "text-green" : "text-blue"}>
              {profile.role}
            </span>
          </span>
          <Link href="/" className="hover:text-text">
            View site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="hover:text-text">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-[220px_1fr]">
        <nav className="border-r border-line px-4 py-6">
          <NavLink href="/admin" label="Dashboard" />
          <p className="mb-2 mt-6 px-3 font-mono text-[10px] tracking-widest text-muted">
            CONTENT
          </p>
          {RESOURCE_CONFIGS.map((r) => (
            <NavLink key={r.slug} href={`/admin/${r.slug}`} label={r.label} />
          ))}
          <p className="mb-2 mt-6 px-3 font-mono text-[10px] tracking-widest text-muted">
            INBOX
          </p>
          <NavLink href="/admin/messages" label="Messages" />
          <p className="mb-2 mt-6 px-3 font-mono text-[10px] tracking-widest text-muted">
            MARKETING
          </p>
          <NavLink href="/admin/newsletter" label="Newsletter" />
          <NavLink href="/admin/campaigns" label="Campaigns" />
          <p className="mb-2 mt-6 px-3 font-mono text-[10px] tracking-widest text-muted">
            INSIGHTS
          </p>
          <NavLink href="/admin/analytics" label="Analytics" />
          <p className="mb-2 mt-6 px-3 font-mono text-[10px] tracking-widest text-muted">
            SETTINGS
          </p>
          <NavLink href="/admin/site-settings" label="Site Settings" />
          {profile.role === "admin" && <NavLink href="/admin/legal" label="Legal Pages" />}
          {profile.role === "admin" && <NavLink href="/admin/users" label="Users & Roles" />}
        </nav>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-bg-2 hover:text-text"
    >
      {label}
    </Link>
  );
}

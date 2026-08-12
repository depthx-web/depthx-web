import Link from "next/link";
import type { LegalPage, SiteSettings } from "@/lib/types";

const PORTFOLIO_LINKS = [
  { href: "/investors", label: "For Investors" },
  { href: "/projects", label: "Projects" },
  { href: "/ip-patents", label: "IP & Patents" },
];

const COMPANY_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/team", label: "Team", key: "global.teamInNav" as const },
  { href: "/news", label: "News", key: "global.newsInNav" as const },
];

const CONNECT_LINKS = [
  { href: "/collaboration", label: "Collaboration" },
  { href: "/contact", label: "Contact" },
];

const COMPANY_LEGAL_NAME = "Depth X Ltd.";
const COMPANY_NUMBER = "16162223";
const COMPANY_ADDRESS = "71-75 Shelton Street, London, Covent Garden, London, England, WC2H 9JQ";

export function Footer({
  settings,
  legalPages,
}: {
  settings: SiteSettings;
  legalPages: LegalPage[];
}) {
  const visibility = settings.sectionVisibility;
  const companyLinks = COMPANY_LINKS.filter(
    (l) => !l.key || visibility[l.key] !== false,
  );

  return (
    <footer className="border-t border-line px-8 pt-16 pb-10 md:px-25">
      <div className="flex flex-wrap justify-between gap-10 pb-11">
        <div className="max-w-70">
          <Link href="/" className="mb-3.5 inline-block font-display text-lg font-bold">
            Depth<span className="text-amber">X</span>
          </Link>
          <p className="text-[13.5px] leading-7 text-muted">{settings.footerText}</p>
        </div>
        <div className="flex flex-wrap gap-14">
          <FooterColumn title="Portfolio" links={PORTFOLIO_LINKS} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Connect" links={CONNECT_LINKS} />
          {legalPages.length > 0 && (
            <FooterColumn
              title="Legal"
              links={legalPages.map((p) => ({ href: `/legal/${p.slug}`, label: p.title }))}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[12.5px] text-muted">
        <div>© {new Date().getFullYear()} Depth X Innovations — All rights reserved</div>
        <div className="font-mono">RESEARCH · VALIDATION · IP · LICENSING</div>
      </div>
      <div className="mt-3 text-[11.5px] leading-6 text-muted opacity-70">
        {COMPANY_LEGAL_NAME} · Registered in England & Wales, Company No. {COMPANY_NUMBER} ·{" "}
        {COMPANY_ADDRESS}
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] tracking-widest text-muted">{title}</p>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block py-1.5 text-[13.5px] opacity-85 hover:text-green hover:opacity-100"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

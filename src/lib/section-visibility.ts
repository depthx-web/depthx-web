// Section visibility system (technical spec §5).
// Every togglable section is keyed here, grouped by page. Adding a new
// togglable section means adding one key (+ label) to SECTION_GROUPS below
// and gating its JSX with isSectionVisible(...) — no other code changes are
// needed to make it controllable from the Admin Panel; the checkbox on
// /admin/site-settings appears automatically.

export const SECTION_GROUPS = [
  {
    page: "Home",
    keys: [
      { key: "home.stats", label: "Stats row" },
      { key: "home.trustBar", label: "Trust bar" },
      { key: "home.flagshipProject", label: "Flagship project card" },
      { key: "home.featuredProjects", label: "Other featured projects" },
      { key: "home.whatWeDo", label: "What We Do" },
      { key: "home.latestNews", label: "Latest News section" },
      { key: "home.contactToggle", label: "Get in Touch toggle" },
      { key: "home.newsletter", label: "Newsletter signup" },
    ],
  },
  {
    page: "For Investors",
    keys: [
      { key: "investors.stats", label: "Stats row" },
      { key: "investors.portfolioTable", label: "Portfolio table" },
      { key: "investors.licensingProcess", label: "Licensing process steps" },
      { key: "investors.pdfSummaryCta", label: "PDF summary CTA" },
      { key: "investors.contactToggle", label: "Start the Conversation toggle" },
      { key: "investors.testimonials", label: "Testimonials" },
      { key: "investors.faq", label: "Licensing FAQ" },
    ],
  },
  {
    page: "Projects",
    keys: [
      { key: "projects.filters", label: "Status filters" },
      { key: "projects.grid", label: "Project grid" },
    ],
  },
  {
    page: "Research",
    keys: [
      { key: "research.domains", label: "Research domains grid" },
      { key: "research.timeline", label: "Method timeline" },
    ],
  },
  {
    page: "IP & Patents",
    keys: [
      { key: "ip.stats", label: "Stats row" },
      { key: "ip.statusDefinitions", label: "Status definitions" },
      { key: "ip.portfolioCta", label: "Portfolio summary CTA" },
    ],
  },
  {
    page: "Publications",
    keys: [{ key: "publications.list", label: "Publications list" }],
  },
  {
    page: "Team",
    keys: [{ key: "team.grid", label: "Team grid" }],
  },
  {
    page: "News",
    keys: [{ key: "news.grid", label: "News grid" }],
  },
  {
    page: "Collaboration",
    keys: [
      { key: "collaboration.partnerLogos", label: "Partner audience chips" },
      { key: "collaboration.partnershipTypes", label: "Partnership types" },
      { key: "collaboration.cta", label: "Start a Collaboration CTA" },
    ],
  },
  {
    page: "Contact",
    keys: [
      { key: "contact.roleToggle", label: "Role toggle" },
      { key: "contact.form", label: "Contact form" },
    ],
  },
  {
    page: "Site-wide",
    keys: [
      { key: "global.newsInNav", label: "News link in nav/footer" },
      { key: "global.teamInNav", label: "Team link in nav/footer" },
    ],
  },
] as const;

export const SECTION_KEYS = SECTION_GROUPS.flatMap((g) => g.keys.map((k) => k.key));

export type SectionKey = (typeof SECTION_KEYS)[number];

export const defaultSectionVisibility: Record<SectionKey, boolean> =
  Object.fromEntries(SECTION_KEYS.map((key) => [key, true])) as Record<
    SectionKey,
    boolean
  >;

/**
 * Server-side check — use directly in Server Components/pages, which is
 * where most section visibility checks happen since content is fetched there.
 */
export function isSectionVisible(
  visibility: Record<string, boolean> | undefined,
  key: SectionKey,
): boolean {
  return visibility?.[key] ?? defaultSectionVisibility[key];
}

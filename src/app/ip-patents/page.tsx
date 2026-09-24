import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { StatGrid } from "@/components/ui/stat-grid";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "IP & Patents",
  description:
    "The patent applications are currently held by the founder, Marwen Ayadi. Assignment of the relevant rights to Depth X Ltd. is planned following formal grant and completion of the appropriate legal process.",
  path: "/ip-patents",
});

const STATUS_DEFINITIONS = [
  {
    label: "Patent Applications Filed",
    color: "border-t-amber",
    desc: "The relevant applications are currently held by the founder, Marwen Ayadi. Assignment to Depth X Ltd. is planned after formal grant and the appropriate legal process is completed.",
  },
  {
    label: "Prototype Engineering",
    color: "border-t-blue",
    desc: "The next phase is prototype engineering and physical validation, followed by outdoor pilot work and future commercialization planning.",
  },
  {
    label: "Commercialization Pathway",
    color: "border-t-green",
    desc: "DepthX develops technology systems and prepares them for future commercialization or technology transfer once the technical and legal milestones are met.",
  },
];

export default async function IpPatentsPage() {
  const settings = await getSiteSettings();
  const visibility = settings.sectionVisibility;

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "IP & Patents" }]} />
      <PageHero
        eyebrow="// INTELLECTUAL PROPERTY"
        title="Founder-held patent applications, technology development, and future commercialization pathways."
        description="The patent applications are currently held by the founder, Marwen Ayadi. Assignment of the relevant rights to Depth X Ltd. is planned following formal grant and completion of the appropriate legal process."
      />
      <section className="px-8 pb-25 md:px-25">
        {isSectionVisible(visibility, "ip.stats") && (
          <div className="mb-16">
            <StatGrid stats={settings.stats} />
          </div>
        )}
        {isSectionVisible(visibility, "ip.statusDefinitions") && (
          <>
            <SectionHead
              eyebrow="// STATUS DEFINITIONS"
              title="How We Classify Projects"
              bordered={false}
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {STATUS_DEFINITIONS.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl border border-t-3 border-line bg-bg-2 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] ${s.color}`}
                >
                  <h4 className="mb-2.5 font-display text-base font-semibold">{s.label}</h4>
                  <p className="text-[13px] leading-6.5 text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {isSectionVisible(visibility, "ip.portfolioCta") && (
          <div className="mt-15 rounded-xl border border-line bg-bg-2 p-8">
            <div className="mb-2 font-mono text-[11px] tracking-widest text-amber">
              FOR INVESTORS
            </div>
            <h3 className="mb-2 font-display text-2xl font-semibold">
              Get the full portfolio in one document
            </h3>
            <p className="mb-5 max-w-xl text-sm leading-7 text-muted">
              A single-page summary of every project&apos;s status, patent number, and licensing
              terms — built for internal review.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/api/portfolio-summary"
                download
                className="inline-flex w-fit rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97]"
              >
                Download PDF Summary
              </a>
              <a
                href="mailto:office@depthx.co.uk"
                className="inline-flex w-fit rounded-md border border-line px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
              >
                Email Us
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

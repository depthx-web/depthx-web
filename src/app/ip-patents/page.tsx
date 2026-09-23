import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { StatGrid } from "@/components/ui/stat-grid";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "IP & Patents",
  description:
    "Two patent applications are currently filed in founder Marwen Ayadi's name and are intended for assignment to Depth X after formal grant.",
  path: "/ip-patents",
});

const STATUS_DEFINITIONS = [
  {
    label: "Founder-Filed Applications",
    color: "border-t-green",
    desc: "Both current patent applications are filed in founder Marwen Ayadi's name. Depth X does not yet own them.",
  },
  {
    label: "Patent Pending",
    color: "border-t-amber",
    desc: "An application has been filed and is under review. Technical details are available under NDA for qualified partners.",
  },
  {
    label: "Assignment Planned",
    color: "border-t-blue",
    desc: "Following formal grant, the patents are intended to be assigned to Depth X, subject to the required legal documentation and register updates.",
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
        title="Two applications filed. Ownership path defined."
        description="Both patent applications are currently filed in founder Marwen Ayadi's name. Following formal grant, they are intended to be assigned to Depth X."
      />
      <section className="px-8 pb-25 md:px-25">
        {isSectionVisible(visibility, "ip.stats") && (
          <div className="mb-16">
            <StatGrid
              stats={[
                { label: "Applications Filed", value: "02" },
                { label: "Current Applicant", value: "FOUNDER" },
                { label: "Patents Granted", value: "00" },
                { label: "Planned Assignee", value: "DEPTH X" },
              ]}
            />
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
              A single-page summary of each project&apos;s priority, application status, and planned
              commercialization route.
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

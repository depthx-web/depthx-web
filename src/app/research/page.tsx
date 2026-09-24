import type { Metadata } from "next";
import { getResearchDomains, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const domains = await getResearchDomains();
  return pageMetadata({
    title: "Research",
    description:
      "Depth X advances research-led concepts and system architecture before prototype engineering, physical validation, and future commercialization or technology transfer.",
    path: "/research",
    keywords: mergeKeywords(domains),
  });
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const TIMELINE = [
  {
    title: "Research and Concept Development",
    desc: "Framing the scientific problem and technical concept before engineering work begins.",
  },
  {
    title: "System Architecture",
    desc: "Defining the platform design, operating model, and technical boundaries.",
  },
  {
    title: "IP Filing",
    desc: "Preparing and filing the relevant patent applications for protectable technology systems.",
  },
  {
    title: "Prototype Engineering",
    desc: "Building the first engineering prototype and preparing for physical validation.",
  },
  {
    title: "Physical Validation",
    desc: "Testing the prototype in controlled conditions before any outdoor pilot or commercial use.",
  },
  {
    title: "Commercialization or Technology Transfer",
    desc: "Preparing the technology for future commercial operation or licensing pathways once the technical and legal milestones are met.",
  },
];

export default async function ResearchPage() {
  const [domains, settings] = await Promise.all([getResearchDomains(), getSiteSettings()]);
  const visibility = settings.sectionVisibility;

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Research" }]} />
      <PageHero
        eyebrow="// CORE RESEARCH FOCUS"
        title={`${NUMBER_WORDS[domains.length] ?? domains.length} domain${domains.length === 1 ? "" : "s"}. One method: depth before commercialization.`}
        description="Depth X advances research-led concepts and system architecture before prototype engineering, physical validation, and future commercialization or technology transfer."
      />
      {isSectionVisible(visibility, "research.domains") && (
        <section className="px-8 pb-25 md:px-25">
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain, i) => (
              <div
                key={domain._id}
                className="rounded-xl border border-line bg-bg-2 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
              >
                <span className="mb-3.5 block font-mono text-xs text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-3 font-display text-lg font-semibold">{domain.name}</h3>
                <p className="text-sm leading-7 text-muted">{domain.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {isSectionVisible(visibility, "research.timeline") && (
        <section className="px-8 pb-25 md:px-25">
          <SectionHead eyebrow="// METHOD" title="From Research to Protected Innovation" />
          <div className="flex gap-0 overflow-x-auto pb-2.5">
            {TIMELINE.map((step, i) => (
              <div key={step.title} className="group relative min-w-52 flex-1 pr-5">
                {i < TIMELINE.length - 1 && (
                  <span className="absolute right-[-10px] top-2.75 left-0 h-px bg-line" />
                )}
                <div className="relative z-10 mb-4.5 flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-blue bg-bg transition-transform duration-300 group-hover:scale-125">
                  <span className="h-2 w-2 rounded-full bg-blue" />
                </div>
                <h4 className="mb-2 font-display text-[15px] font-semibold">{step.title}</h4>
                <p className="text-[13px] leading-6 text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

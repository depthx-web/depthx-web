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
      "We build scientific foundations first, then translate them into applied systems and protected intellectual property.",
    path: "/research",
    keywords: mergeKeywords(domains),
  });
}

const TIMELINE = [
  {
    title: "Scientific Research",
    desc: "Framing new scientific questions for emerging techno-economic environments.",
  },
  {
    title: "Experimental Validation",
    desc: "Testing systems under real-world conditions to confirm feasibility.",
  },
  {
    title: "Intellectual Property",
    desc: "Filing and securing patents to protect validated innovations.",
  },
  {
    title: "Spin-off Applications",
    desc: "Licensing or spinning out technology into deployable commercial systems.",
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
        title="Three domains. One method: depth before deployment."
        description="We build scientific foundations first, then translate them into applied systems and protected intellectual property."
      />
      {isSectionVisible(visibility, "research.domains") && (
        <section className="px-8 pb-25 md:px-25">
          <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
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

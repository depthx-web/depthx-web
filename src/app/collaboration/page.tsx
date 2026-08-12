import type { Metadata } from "next";
import Link from "next/link";
import { getPartnershipTypes, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const partnershipTypes = await getPartnershipTypes();
  return pageMetadata({
    title: "Collaboration",
    description:
      "We work closely with a small number of partners who share our commitment to scientific rigor, ethical research, and measurable validation.",
    path: "/collaboration",
    keywords: mergeKeywords(partnershipTypes),
  });
}

const AUDIENCES = [
  "ACADEMIC INSTITUTIONS",
  "RESEARCH LABORATORIES",
  "INNOVATION AGENCIES",
  "STRATEGIC INDUSTRIAL PARTNERS",
];

export default async function CollaborationPage() {
  const [partnershipTypes, settings] = await Promise.all([
    getPartnershipTypes(),
    getSiteSettings(),
  ]);
  const showLogos = isSectionVisible(settings.sectionVisibility, "collaboration.partnerLogos");

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Collaboration" }]} />
      <PageHero
        eyebrow="// SELECTIVE PARTNERSHIPS"
        title="Collaboration & Validation"
        description="We work closely with a small number of partners who share our commitment to scientific rigor, ethical research, and measurable validation."
      />
      <section className="px-8 pb-25 md:px-25">
        {showLogos && (
          <div className="flex flex-wrap gap-3.5">
            {AUDIENCES.map((a) => (
              <div
                key={a}
                className="rounded-lg border border-line bg-bg-2 px-5.5 py-3.5 font-mono text-xs text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:text-text"
              >
                {a}
              </div>
            ))}
          </div>
        )}
        {isSectionVisible(settings.sectionVisibility, "collaboration.partnershipTypes") && (
          <div className="mt-15">
            <SectionHead eyebrow="// WAYS TO PARTNER" title="Partnership Types" bordered={false} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {partnershipTypes.map((p) => (
                <div
                  key={p._id}
                  className="rounded-xl border border-line bg-bg-2 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
                >
                  <h4 className="mb-2.5 font-display text-base font-semibold">{p.name}</h4>
                  <p className="text-[13.5px] leading-6.5 text-muted">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {isSectionVisible(settings.sectionVisibility, "collaboration.cta") && (
          <Link
            href="/contact"
            className="mt-10 inline-flex w-fit rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97]"
          >
            Start a Collaboration
          </Link>
        )}
      </section>
    </>
  );
}

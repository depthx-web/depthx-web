import type { Metadata } from "next";
import { getPublications, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { PublicationList } from "@/components/publication-list";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const publications = await getPublications();
  return pageMetadata({
    title: "Publications",
    description:
      "Founder-authored research preprints and publications documenting the technical concepts, architecture, and research foundations behind DepthX technologies.",
    path: "/publications",
    keywords: mergeKeywords(publications),
  });
}

export default async function PublicationsPage() {
  const [publications, settings] = await Promise.all([getPublications(), getSiteSettings()]);

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Publications" }]} />
      <PageHero
        eyebrow="// RESEARCH PAPERS & PREPRINTS"
        title="Publications"
        description="Founder-authored research preprints and publications documenting the technical concepts, architecture, and research foundations behind DepthX technologies."
      />
      {isSectionVisible(settings.sectionVisibility, "publications.list") && (
        <section className="px-8 pb-25 md:px-25">
          <PublicationList publications={publications} />
        </section>
      )}
    </>
  );
}

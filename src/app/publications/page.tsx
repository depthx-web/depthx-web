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
      "Scientific output produced alongside our applied research, shared with the academic community.",
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
        eyebrow="// PEER-REVIEWED WORK"
        title="Publications"
        description="Scientific output produced alongside our applied research, shared with the academic community."
      />
      {isSectionVisible(settings.sectionVisibility, "publications.list") && (
        <section className="px-8 pb-25 md:px-25">
          <PublicationList publications={publications} />
        </section>
      )}
    </>
  );
}

import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { ProjectFilterGrid } from "@/components/project-filter-grid";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Every project is tracked from validation through IP status, so you always know exactly how close a technology is to commercial deployment.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
      <PageHero
        eyebrow="// PORTFOLIO"
        title="Current Projects"
        description="Every project below is tracked from validation through IP status, so you always know exactly how close a technology is to commercial deployment. Filter by patent stage or browse by research domain."
      />
      {isSectionVisible(settings.sectionVisibility, "projects.grid") && (
        <section className="px-8 pb-25 md:px-25">
          <ProjectFilterGrid
            projects={projects}
            showFilters={isSectionVisible(settings.sectionVisibility, "projects.filters")}
          />
        </section>
      )}
    </>
  );
}

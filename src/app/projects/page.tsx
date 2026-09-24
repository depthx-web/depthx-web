import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { ProjectFilterGrid } from "@/components/project-filter-grid";
import { pageMetadata } from "@/lib/page-metadata";
import { PRODUCT_PRIORITY, UAV_PROJECT_SLUG } from "@/lib/approved-public-content";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Depth X tracks each technology from concept and system architecture to patent application, prototype engineering, physical validation, and future commercialization planning.",
  path: "/projects",
});
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const priorityProject = projects.find((project) => project.slug === UAV_PROJECT_SLUG);
  const productPriority = priorityProject?.productPriority ?? PRODUCT_PRIORITY;

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
      <PageHero
        eyebrow="// PORTFOLIO"
        title="Current Projects"
        description="Depth X tracks each technology from concept and system architecture to patent application, prototype engineering, physical validation, and future commercialization planning. Filter by project stage or browse by research domain."
      />
      <section className="px-8 pb-10 md:px-25">
        <p className="max-w-3xl text-sm leading-7 text-muted">{productPriority}</p>
      </section>
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

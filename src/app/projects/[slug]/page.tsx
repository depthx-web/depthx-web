import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { Breadcrumb } from "@/components/ui/page-hero";
import { CommercialStatusBadge, ProjectStatusLine } from "@/components/ui/status-badge";
import { ProductSimulator } from "@/components/ui/product-simulator";
import { pageMetadata } from "@/lib/page-metadata";
import {
  commercialStatusLabel,
  developmentStageLabel,
  ipStatusLabel,
  shouldShowCommercialStatus,
} from "@/lib/project-status";
import {
  SMART_VENDING_PROJECT_SLUG,
  UAV_PROJECT_SLUG,
} from "@/lib/approved-public-content";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) return { title: "Project" };
  const description =
    slug === UAV_PROJECT_SLUG
      ? "Depth X's first commercialization priority: a patent-pending, pre-prototype autonomous multi-UAV platform with engineering build next."
      : slug === SMART_VENDING_PROJECT_SLUG
        ? "Depth X's second technology in the pipeline, planned for market after the autonomous multi-UAV platform advances through prototype engineering and validation."
        : project.shortDescription;
  return pageMetadata({
    title: project.title,
    description,
    path: `/projects/${project.slug}`,
    keywords: project.keywords,
  });
}

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />
      <div className="px-8 pb-0 pt-6 md:px-25">
        <div className="mb-5 font-mono text-xs tracking-widest" style={{ color: "var(--color-amber)" }}>
          {"// "}
          {project.researchDomain.name.toUpperCase()}
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          {project.title}
        </h1>
      </div>
      <section className="grid grid-cols-1 gap-10 px-8 pt-10 pb-25 md:grid-cols-[2fr_1fr] md:px-25">
        <div>
          <DetailBlock title="Overview">
            <p>{project.overview}</p>
          </DetailBlock>
          <DetailBlock title="Project Status">
            <ProjectStatusLine project={project} />
          </DetailBlock>
          {project.researchCollaboration && (
            <DetailBlock title="Research Collaboration">
              <p>{project.researchCollaboration}</p>
            </DetailBlock>
          )}
          {project.engineeringCollaboration && (
            <DetailBlock title="Engineering Collaboration">
              <p>{project.engineeringCollaboration}</p>
            </DetailBlock>
          )}
          {project.simulatorHtml && (
            <div className="mb-9">
              <ProductSimulator html={project.simulatorHtml} />
            </div>
          )}
          <DetailBlock title="Research Domain">
            <p>{project.researchDomain.name}</p>
          </DetailBlock>
          {project.relatedPublications.length > 0 && (
            <DetailBlock title="Related Publications">
              <ul className="flex flex-col gap-2">
                {project.relatedPublications.map((pub) => (
                  <li key={pub._id}>
                    <Link href="/publications" className="text-blue hover:text-text">
                      {pub.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          )}
        </div>
        <div className="sticky top-25 flex h-fit flex-col gap-4 rounded-xl border border-line bg-bg-2 p-6.5">
          <ProjectStatusLine project={project} />
          <CommercialStatusBadge status={project.commercialStatus} />
          <SpecRow k="DEVELOPMENT" v={developmentStageLabel(project.developmentStage)} />
          <SpecRow k="IP STATUS" v={ipStatusLabel(project.ipStatus)} />
          {project.nextMilestone && <SpecRow k="NEXT MILESTONE" v={project.nextMilestone} />}
          {shouldShowCommercialStatus(project.commercialStatus) && (
            <SpecRow k="COMMERCIAL" v={commercialStatusLabel(project.commercialStatus)} />
          )}
          <SpecRow k="DOMAIN" v={project.researchDomain.name} alignRight />
          {project.commercialStatus === "available_for_licensing" ? (
            <a
              href="mailto:invest@depthx.co.uk"
              className="mt-2 w-full rounded-md bg-green px-6 py-3 text-center text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4]"
            >
              Request Licensing
            </a>
          ) : (
            <Link
              href="/contact"
              className="mt-2 w-full rounded-md border border-line px-6 py-3 text-center text-sm font-semibold hover:border-blue hover:bg-blue/10"
            >
              Discuss Collaboration
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-9">
      <h3 className="mb-3.5 font-display text-lg font-semibold">{title}</h3>
      <div className="text-[15px] leading-8 text-muted">{children}</div>
    </div>
  );
}

function SpecRow({ k, v, alignRight }: { k: string; v: string; alignRight?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line py-3 text-[13px] last:border-none sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-3">
      <span className="min-w-0 font-mono text-[11px] text-muted">{k}</span>
      <span className={`min-w-0 break-words text-left font-semibold ${alignRight ? "sm:text-right" : ""}`}>{v}</span>
    </div>
  );
}

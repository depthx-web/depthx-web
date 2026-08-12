import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { Breadcrumb } from "@/components/ui/page-hero";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/components/ui/project-card";
import { ProductSimulator } from "@/components/ui/product-simulator";
import { pageMetadata } from "@/lib/page-metadata";

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
  return pageMetadata({
    title: project.title,
    description: project.shortDescription,
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
          <StatusBadge status={project.status} />
          <SpecRow k="PATENT NO." v={project.patentNumber ?? "Application filed"} />
          <SpecRow k="FILED" v={project.filedDate ? formatDate(project.filedDate) : "—"} />
          <SpecRow k="GRANTED" v={project.grantedDate ? formatDate(project.grantedDate) : "—"} />
          <SpecRow k="DOMAIN" v={project.researchDomain.name} alignRight />
          {project.status === "licensing" ? (
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
    <div className="flex justify-between border-b border-line py-3 text-[13px] last:border-none">
      <span className="font-mono text-[11px] text-muted">{k}</span>
      <span className={`font-semibold ${alignRight ? "text-right" : ""}`}>{v}</span>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPage, getLegalPages } from "@/lib/content";
import { Breadcrumb } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateStaticParams() {
  const pages = await getLegalPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/legal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getLegalPage(slug);
  if (!page) return { title: "Not found" };
  return pageMetadata({
    title: page.title,
    description: `${page.title} for Depth X Innovations.`,
    path: `/legal/${page.slug}`,
  });
}

export default async function LegalPage(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const page = await getLegalPage(slug);
  if (!page) notFound();

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <div className="px-8 pt-6 pb-0 md:px-25">
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          {page.title}
        </h1>
      </div>
      <section className="px-8 py-10 md:px-25">
        <div className="max-w-2xl whitespace-pre-line text-[15px] leading-8 text-muted">
          {page.body}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPost, getNewsPosts } from "@/lib/content";
import { Breadcrumb } from "@/components/ui/page-hero";
import { formatDate } from "@/lib/format-date";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateStaticParams() {
  const posts = await getNewsPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/news/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "News" };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    keywords: post.keywords,
    image: post.imageUrl,
  });
}

export default async function NewsDetailPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: post.title },
        ]}
      />
      <div className="px-8 pt-6 pb-0 md:px-25">
        <span className="font-mono text-[10.5px] tracking-wide text-blue">{post.tag}</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 font-mono text-xs text-muted">{formatDate(post.date)}</div>
      </div>
      {post.imageUrl && (
        <div className="px-8 pt-8 md:px-25">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URL */}
          <img
            src={post.imageUrl}
            alt=""
            className="max-h-125 w-full max-w-3xl rounded-xl border border-line object-cover"
          />
        </div>
      )}
      <section className="px-8 py-10 md:px-25">
        <div className="max-w-2xl text-[15px] leading-8 whitespace-pre-line text-muted">
          {post.body}
        </div>
      </section>
    </>
  );
}

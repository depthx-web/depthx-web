import type { Metadata } from "next";
import Link from "next/link";
import { getNewsPosts, getSiteSettings } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { formatDate } from "@/lib/format-date";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getNewsPosts();
  return pageMetadata({
    title: "News",
    description: "Milestones, publications, and developments from across our research programmes.",
    path: "/news",
    keywords: mergeKeywords(posts),
  });
}

export default async function NewsPage() {
  const [posts, settings] = await Promise.all([getNewsPosts(), getSiteSettings()]);

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <PageHero
        eyebrow="// UPDATES"
        title="News & Insights"
        description="Milestones, publications, and developments from across our research programmes."
      />
      {isSectionVisible(settings.sectionVisibility, "news.grid") && (
        <section className="px-8 pb-25 md:px-25">
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/news/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2 transition-all hover:-translate-y-1 hover:border-line-2"
              >
                {post.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URL
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="h-40 w-full border-b border-line object-cover"
                  />
                )}
                <div className="flex flex-grow flex-col gap-3 p-6.5">
                  <span className="font-mono text-[10.5px] tracking-wide text-blue">
                    {post.tag}
                  </span>
                  <h4 className="font-display text-[16.5px] leading-snug font-semibold">
                    {post.title}
                  </h4>
                  <p className="flex-grow text-[13.5px] leading-6.5 text-muted">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-muted">
                    <span>{formatDate(post.date)}</span>
                    <span className="text-blue">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

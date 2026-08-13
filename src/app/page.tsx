import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedProject,
  getNewsPosts,
  getProjects,
  getResearchDomains,
  getSiteSettings,
} from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { StatGrid } from "@/components/ui/stat-grid";
import { ProjectCard } from "@/components/ui/project-card";
import { formatDate } from "@/lib/format-date";
import { FlagshipCard } from "@/components/ui/flagship-card";
import { RoleToggle } from "@/components/contact/role-toggle";
import { SectionHead } from "@/components/ui/page-hero";
import { NewsletterSection } from "@/components/newsletter-section";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [settings, projects, featured, domains, newsPosts] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getFeaturedProject(),
    getResearchDomains(),
    getNewsPosts(),
  ]);
  const visibility = settings.sectionVisibility;
  const otherProjects = projects.filter((p) => p._id !== featured?._id);
  const latestNews = newsPosts.slice(0, 3);

  return (
    <>
      <header className="flex min-h-[92vh] flex-col justify-center px-8 pb-20 pt-35 md:px-25 md:pl-25 md:pr-16">
        <div className="mb-5 flex items-center gap-2.5 font-mono text-xs tracking-widest text-amber before:h-px before:w-6 before:bg-amber">
          PATENTED · VALIDATED · READY TO LICENSE
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight md:text-7xl">
          {settings.heroHeadline}
          <br />
          <span className="text-green">{settings.heroHeadlineAccent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{settings.heroSubtext}</p>
        <div className="mt-10 flex flex-wrap gap-3.5">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-green px-6 py-3.5 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97]"
          >
            Get in Touch →
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md border border-line px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
          >
            View Portfolio
          </Link>
        </div>
      </header>

      {isSectionVisible(visibility, "home.stats") && (
        <section className="px-8 pb-15 md:px-25">
          <Reveal>
            <StatGrid stats={settings.stats} />
          </Reveal>
        </section>
      )}

      {isSectionVisible(visibility, "home.trustBar") && settings.trustBarLogos.length > 0 && (
        <div className="mx-8 flex flex-wrap items-center gap-7 border-y border-line py-7 md:mx-25">
          <span className="whitespace-nowrap font-mono text-xs tracking-wide text-muted">
            VALIDATED WITH
          </span>
          <div className="flex flex-1 flex-wrap gap-4">
            {settings.trustBarLogos.map((logo) =>
              logo.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URL
                <img
                  key={logo.name}
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-8 w-auto opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <div
                  key={logo.name}
                  className="rounded-md border border-line px-4.5 py-2.5 font-display text-sm font-semibold text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:text-text"
                >
                  {logo.name}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {(isSectionVisible(visibility, "home.flagshipProject") ||
        isSectionVisible(visibility, "home.featuredProjects")) && (
        <section className="px-8 py-25 md:px-25">
          <SectionHead
            eyebrow="// PORTFOLIO SNAPSHOT"
            title="Featured Projects"
            action={
              <Link
                href="/projects"
                className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
              >
                View All Projects →
              </Link>
            }
          />
          <Reveal className="grid grid-cols-1 gap-5.5 md:grid-cols-2 lg:grid-cols-3">
            {isSectionVisible(visibility, "home.flagshipProject") && featured && (
              <div className="md:col-span-2 lg:col-span-3">
                <FlagshipCard project={featured} />
              </div>
            )}
            {isSectionVisible(visibility, "home.featuredProjects") &&
              otherProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
          </Reveal>
        </section>
      )}

      {isSectionVisible(visibility, "home.whatWeDo") && (
        <section className="px-8 py-25 md:px-25">
          <SectionHead
            eyebrow="// THE SCIENTIFIC FOUNDATION"
            title="What We Do"
            action={
              <Link
                href="/research"
                className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
              >
                Explore Research →
              </Link>
            }
          />
          <Reveal className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain, i) => (
              <Link
                href="/research"
                key={domain._id}
                className="group rounded-xl border border-line bg-bg-2 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
              >
                <span className="mb-3.5 block font-mono text-xs text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-3 font-display text-lg font-semibold transition-colors group-hover:text-green">
                  {domain.name}
                </h3>
                <p className="text-sm leading-7 text-muted">{domain.description}</p>
              </Link>
            ))}
          </Reveal>
        </section>
      )}

      {isSectionVisible(visibility, "home.latestNews") && latestNews.length > 0 && (
        <section className="px-8 py-25 md:px-25">
          <SectionHead
            eyebrow="// UPDATES"
            title="Latest News"
            action={
              <Link
                href="/news"
                className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
              >
                View All News →
              </Link>
            }
          />
          <Reveal className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post) => (
              <Link
                key={post._id}
                href={`/news/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
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
          </Reveal>
        </section>
      )}

      {isSectionVisible(visibility, "home.contactToggle") && (
        <section className="px-8 py-25 md:px-25">
          <SectionHead eyebrow="// ENGAGE WITH US" title="Get in Touch" bordered={false} />
          <Reveal>
            <RoleToggle emails={settings.contactEmails} />
          </Reveal>
        </section>
      )}

      {isSectionVisible(visibility, "home.newsletter") && <NewsletterSection />}
    </>
  );
}

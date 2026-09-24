import type { Metadata } from "next";
import Link from "next/link";
import { getFaqItems, getProjects, getSiteSettings, getTestimonials } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero, SectionHead } from "@/components/ui/page-hero";
import { StatGrid } from "@/components/ui/stat-grid";
import { IpStatusBadge } from "@/components/ui/status-badge";
import { RoleToggle } from "@/components/contact/role-toggle";
import { FaqList } from "@/components/faq-list";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";
import { commercialStatusLabel, developmentStageLabel } from "@/lib/project-status";
import {
  EMQOPTER_STATEMENT,
  ORIGIN_STORY,
} from "@/lib/approved-public-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [testimonials, faqItems] = await Promise.all([getTestimonials(), getFaqItems()]);
  return pageMetadata({
    title: "For Investors",
    description:
      "A clear starting point for evaluating Depth X — current IP status, licensing model, and how to start a conversation.",
    path: "/investors",
    keywords: mergeKeywords([...testimonials, ...faqItems]),
  });
}

const LICENSING_STEPS = [
  { n: "01", title: "Initial Inquiry", desc: "Share your interest and use case via the form below or direct email." },
  { n: "02", title: "NDA & Technical Review", desc: "We share full technical documentation under a mutual NDA." },
  { n: "03", title: "Term Sheet", desc: "We agree on scope, exclusivity, and commercial terms." },
  { n: "04", title: "License Agreement", desc: "Formal agreement signed and technology transfer begins." },
];

export default async function InvestorsPage() {
  const [settings, projects, testimonials, faqItems] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getTestimonials(),
    getFaqItems(),
  ]);
  const visibility = settings.sectionVisibility;

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "For Investors" }]} />
      <PageHero
        eyebrow="// INVESTOR OVERVIEW"
        eyebrowColor="var(--color-green)"
        title="Technology development and commercialization pathways."
        description="A clear starting point for evaluating Depth X — the company’s research model, current patent filing status, and future commercialization roadmap."
      />
      <section className="px-8 pb-25 md:px-25">
        <div className="mb-17">
          <div className="border-l-2 border-amber pl-5 text-sm leading-7 text-muted">{EMQOPTER_STATEMENT}</div>
        </div>
        <p className="mb-17 max-w-3xl text-sm leading-7 text-muted">{ORIGIN_STORY}</p>
        {isSectionVisible(visibility, "investors.stats") && (
          <div className="mb-17">
            <StatGrid stats={settings.stats} />
          </div>
        )}

        {isSectionVisible(visibility, "investors.portfolioTable") && (
          <>
            <SectionHead
              eyebrow="// FULL PORTFOLIO"
              title="Project Status at a Glance"
              bordered={false}
            />
            <div className="mb-17 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {["Project", "Development", "IP Status", "Commercial", "Next Milestone"].map((h) => (
                      <th
                        key={h}
                        className="border-b border-line-2 px-3 py-3.5 text-left font-mono text-[11px] tracking-wide text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                    <tr key={p._id} className="transition-colors hover:bg-hover">
                      <td className="border-b border-line px-3 py-4 align-middle">
                        <Link href={`/projects/${p.slug}`} className="font-display text-[14.5px] font-semibold hover:text-green">
                          {p.title}
                        </Link>
                      </td>
                      <td className="border-b border-line px-3 py-4 align-middle font-mono text-[11px] text-muted">
                        {developmentStageLabel(p.developmentStage)}
                      </td>
                      <td className="border-b border-line px-3 py-4 align-middle">
                        <IpStatusBadge status={p.ipStatus} showAll />
                      </td>
                      <td className="border-b border-line px-3 py-4 align-middle font-mono text-[11px] text-muted">
                        {commercialStatusLabel(p.commercialStatus)}
                      </td>
                      <td className="border-b border-line px-3 py-4 align-middle font-mono text-[11px] text-muted">
                        {p.nextMilestone ?? "—"}
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isSectionVisible(visibility, "investors.licensingProcess") && (
          <>
            <SectionHead eyebrow="// HOW IT WORKS" title="Licensing Process" bordered={false} />
            <div className="mb-17 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {LICENSING_STEPS.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-line bg-bg-2 p-5.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
                >
                  <span className="mb-2.5 block font-mono text-xs text-green">{s.n}</span>
                  <h4 className="mb-2 font-display text-[15px] font-semibold">{s.title}</h4>
                  <p className="text-[13px] leading-6.5 text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {isSectionVisible(visibility, "investors.pdfSummaryCta") && (
          <div className="mb-17 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-line bg-gradient-to-br from-bg-2 to-bg-3 p-7">
            <div>
              <h4 className="mb-1.5 font-display text-[17px] font-semibold">
                Get the one-page portfolio summary
              </h4>
              <p className="text-[13.5px] text-muted">
                Status, patent numbers, and licensing terms for every project — built for internal
                review.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/api/portfolio-summary"
                download
                className="rounded-md bg-green px-6 py-3.5 text-sm font-semibold text-[#06140F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5EE6B4] hover:shadow-[0_8px_24px_-8px_rgba(62,214,160,0.55)] active:translate-y-0 active:scale-[0.97]"
              >
                Download PDF Summary
              </a>
              <a
                href="mailto:office@depthx.co.uk"
                className="rounded-md border border-line px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:bg-blue/10 active:translate-y-0 active:scale-[0.97]"
              >
                Email Us
              </a>
            </div>
          </div>
        )}

        {isSectionVisible(visibility, "investors.contactToggle") && (
          <>
            <SectionHead eyebrow="// SPEAK WITH US" title="Start the Conversation" bordered={false} />
            <div className="mb-17">
              <RoleToggle emails={settings.contactEmails} />
            </div>
          </>
        )}

        {isSectionVisible(visibility, "investors.testimonials") && (
          <>
            <SectionHead eyebrow="// VALIDATION" title="What Partners Say" bordered={false} />
            <div className="mb-17 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-bg-2 p-6.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
                >
                  <div className="font-display text-3xl leading-none text-green">&ldquo;</div>
                  <p className="text-[14.5px] italic leading-7">{t.quote}</p>
                  <div className="border-t border-line pt-3.5 font-mono text-[11px] text-muted">
                    {[t.attributionName, t.attributionRole].filter(Boolean).join(" · ").toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isSectionVisible(visibility, "investors.faq") && (
          <>
            <SectionHead eyebrow="// COMMON QUESTIONS" title="Licensing FAQ" bordered={false} />
            <FaqList items={faqItems} />
          </>
        )}
      </section>
    </>
  );
}

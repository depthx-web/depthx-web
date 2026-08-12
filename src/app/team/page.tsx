import type { Metadata } from "next";
import { getSiteSettings, getTeamMembers } from "@/lib/content";
import { isSectionVisible } from "@/lib/section-visibility";
import { Breadcrumb, PageHero } from "@/components/ui/page-hero";
import { mergeKeywords, pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const team = await getTeamMembers();
  return pageMetadata({
    title: "Team",
    description:
      "Depth X stays lean by design — every project is led directly by researchers with hands-on domain expertise.",
    path: "/team",
    keywords: mergeKeywords(team),
  });
}

export default async function TeamPage() {
  const [team, settings] = await Promise.all([getTeamMembers(), getSiteSettings()]);

  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Team" }]} />
      <PageHero
        eyebrow="// THE PEOPLE BEHIND THE RESEARCH"
        title="A small team, deliberately."
        description="Depth X stays lean by design — every project is led directly by researchers with hands-on domain expertise."
      />
      {isSectionVisible(settings.sectionVisibility, "team.grid") && (
        <section className="px-8 pb-25 md:px-25">
          <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member._id}
                className="group rounded-xl border border-line bg-bg-2 p-6.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
              >
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URL, not a known image domain
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="mb-4 h-13 w-13 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="mb-4 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-green to-blue font-display text-lg font-bold text-[#06140F] transition-transform duration-300 group-hover:scale-110">
                    {member.name
                      .replace(/^Dr\.\s*/, "")
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                )}
                <h4 className="mb-1 font-display text-base font-semibold">{member.name}</h4>
                <span className="mb-3 block font-mono text-[11px] tracking-wide text-amber">
                  {member.role.toUpperCase()}
                </span>
                <p className="text-[13px] leading-6.5 text-muted">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

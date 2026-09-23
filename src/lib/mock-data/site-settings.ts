import type { SiteSettings } from "@/lib/types";
import { defaultSectionVisibility } from "@/lib/section-visibility";

export const siteSettings: SiteSettings = {
  heroHeadline: "Research. Develop. Protect.",
  heroHeadlineAccent: "Prepare for commercialization.",
  heroSubtext:
    "Depth X develops research-driven technologies, protects them through intellectual property, and validates them before commercialization through specialized operating companies.",
  stats: [
    { label: "Patent Applications Filed", value: "02" },
    { label: "Technologies in Development", value: "02" },
    { label: "Active Prototype Priority", value: "01" },
    { label: "Research Domains", value: "04" },
  ],
  trustBarLogos: [],
  footerText:
    "Research and development that moves protected technology toward validated products and specialized commercial operation.",
  contactEmails: {
    investor: "invest@depthx.co.uk",
    researcher: "research@depthx.co.uk",
    company: "partnerships@depthx.co.uk",
  },
  sectionVisibility: defaultSectionVisibility,
};

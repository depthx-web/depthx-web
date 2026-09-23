import type { SiteSettings } from "@/lib/types";
import { defaultSectionVisibility } from "@/lib/section-visibility";

export const siteSettings: SiteSettings = {
  heroHeadline: "From original research",
  heroHeadlineAccent: "to technology built for market.",
  heroSubtext:
    "Depth X turns research-led ideas into protected, validated technologies, then creates a focused path to commercial operation.",
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

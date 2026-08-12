import type { SiteSettings } from "@/lib/types";
import { defaultSectionVisibility } from "@/lib/section-visibility";

export const siteSettings: SiteSettings = {
  heroHeadline: "Deep-tech innovation,",
  heroHeadlineAccent: "protected and ready to license.",
  heroSubtext:
    "Depth X converts rigorous research into patented systems — with a live portfolio currently open for licensing and investment.",
  stats: [
    { label: "Patents Filed", value: "07" },
    { label: "Patents Granted", value: "03" },
    { label: "Open for Licensing", value: "02" },
    { label: "Research Domains", value: "03" },
  ],
  trustBarLogos: [
    { name: "Univ. Research Lab" },
    { name: "Innovation Agency" },
    { name: "Industrial Partner Co." },
    { name: "Applied Systems Institute" },
  ],
  footerText:
    "Bridging science and real-world systems through deep innovation — from theoretical research to verified, deployable technologies.",
  contactEmails: {
    investor: "invest@depthx.co.uk",
    researcher: "research@depthx.co.uk",
    company: "partnerships@depthx.co.uk",
  },
  sectionVisibility: defaultSectionVisibility,
};

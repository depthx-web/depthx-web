import type { SiteSettings } from "@/lib/types";
import { defaultSectionVisibility } from "@/lib/section-visibility";

export const siteSettings: SiteSettings = {
  heroHeadline: "Researching technologies.",
  heroHeadlineAccent: "Building protected systems. Preparing them for market.",
  heroSubtext:
    "Depth X is an R&D and technology commercialization company. Our first commercialization priority is a patent-pending autonomous multi-UAV platform for adaptive outdoor advertising and anonymous audience measurement. The platform is currently at the pre-prototype stage, with the engineering build as the next milestone.",
  stats: [
    { label: "Research domains", value: "03" },
    { label: "Current focus", value: "Concept & architecture" },
    { label: "Next sequence", value: "IP → prototype → validation" },
    { label: "Portfolio stage", value: "Pre-prototype" },
  ],
  trustBarLogos: [
    { name: "Univ. Research Lab" },
    { name: "Innovation Agency" },
    { name: "Industrial Partner Co." },
    { name: "Applied Systems Institute" },
  ],
  footerText:
    "Bridging science and real-world systems through deep innovation — from research concepts to protected systems and future commercialization pathways.",
  contactEmails: {
    investor: "invest@depthx.co.uk",
    researcher: "research@depthx.co.uk",
    company: "partnerships@depthx.co.uk",
  },
  sectionVisibility: defaultSectionVisibility,
};

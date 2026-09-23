import type { Project } from "@/lib/types";
import { researchDomains } from "@/lib/mock-data/research-domains";

const hybridMarketing =
  researchDomains.find((domain) => domain.slug === "hybrid-marketing-science") ??
  researchDomains[0];

export const projects: Project[] = [
  {
    _id: "project-autonomous-aerial-marketing",
    title: "Autonomous Aerial Marketing Platform",
    slug: "autonomous-aerial-advertising-system",
    status: "pending",
    researchDomain: hybridMarketing,
    shortDescription:
      "A patent-pending multi-UAV platform for persistent aerial advertising, anonymous audience measurement, and adaptive campaign execution.",
    overview:
      "Depth X is developing the system as its first commercialization priority. The project is currently pre-prototype, with the four-UAV MVP architecture and roadmap defined. emQopter GmbH is the external technical collaborator prepared to build the complete prototype. The related German and international patent applications are currently filed in founder Marwen Ayadi's name and are intended to be assigned to Depth X after formal grant.",
    patentNumberKind: "application",
    readinessStage: 2,
    relatedPublications: [],
    featured: true,
    visible: true,
  },
  {
    _id: "project-smart-vending-virtual-try-on",
    title: "AI-Powered Smart Vending System for Virtual Clothing Try-On",
    slug: "smart-vending-virtual-clothing-try-on",
    status: "pending",
    researchDomain: hybridMarketing,
    shortDescription:
      "A smart retail concept combining automated vending with AI-enabled virtual clothing try-on and an adaptive customer experience.",
    overview:
      "This technology is the second commercialization project in the Depth X pipeline. Development and launch will follow the UAV platform so resources remain focused on one market entry at a time. The related application is currently filed in founder Marwen Ayadi's name and is intended to be assigned to Depth X after formal grant, before licensing to a specialized operating company.",
    patentNumber: "DE 10 2025 004 854.8",
    patentNumberKind: "application",
    readinessStage: 2,
    relatedPublications: [],
    featured: false,
    visible: true,
  },
];

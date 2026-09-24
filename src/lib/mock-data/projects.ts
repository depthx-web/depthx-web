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
      "The autonomous multi-UAV platform is Depth X Ltd's first commercialization priority. It is currently at the pre-prototype stage, with the engineering build as the next milestone. emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.",
    patentNumberKind: "application",
    developmentStage: "system_architecture",
    ipStatus: "patent_pending",
    commercialStatus: "commercialization_planning",
    productPriority:
      "The autonomous multi-UAV platform is Depth X Ltd's first commercialization priority. The smart vending system is the second technology in the pipeline and will be developed for market after the UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.",
    nextMilestone: "Engineering Build Next",
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
      "The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.",
    patentNumberKind: "application",
    developmentStage: "research_concept",
    ipStatus: "patent_pending",
    commercialStatus: "not_offered",
    productPriority:
      "The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.",
    nextMilestone: "Planned After UAV Validation",
    readinessStage: 2,
    relatedPublications: [],
    featured: false,
    visible: true,
  },
];

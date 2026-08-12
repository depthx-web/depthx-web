import type { ResearchDomain } from "@/lib/types";

export const researchDomains: ResearchDomain[] = [
  {
    _id: "domain-hybrid",
    name: "Hybrid Physical–Digital Systems",
    slug: "hybrid-physical-digital-systems",
    description:
      "We combine sensor fusion with real-time behavioral modeling to study how physical environments, human presence, and digital decision layers can operate as one system — then validate that model against live commercial deployments.",
    order: 1,
    visible: true,
  },
  {
    _id: "domain-autonomous",
    name: "Autonomous & Intelligent Platforms",
    slug: "autonomous-intelligent-platforms",
    description:
      "Our research develops shared decision layers for coordinating autonomous and semi-autonomous units — including aerial and distributed platforms — with an emphasis on failure-mode testing before any system operates in public or urban airspace.",
    order: 2,
    visible: true,
  },
  {
    _id: "domain-cyber-physical",
    name: "Cyber-Physical Interaction & Decision Systems",
    slug: "cyber-physical-interaction-decision-systems",
    description:
      "We build and test the interpretation layer that lets intelligent systems read human behavior and environmental signals and turn that reading into a real-time, real-world response.",
    order: 3,
    visible: true,
  },
];

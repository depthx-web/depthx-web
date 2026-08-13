import type { Project } from "@/lib/types";
import { researchDomains } from "@/lib/mock-data/research-domains";
import { publications } from "@/lib/mock-data/publications";

const hybrid = researchDomains[0];
const autonomous = researchDomains[1];
const cyberPhysical = researchDomains[2];

export const projects: Project[] = [
  {
    _id: "project-adaptive-interaction",
    title: "Adaptive interaction system for smart commercial environments",
    slug: "adaptive-interaction",
    status: "granted",
    researchDomain: hybrid,
    shortDescription:
      "A platform integrating physical presence and user behavior with real-time digital decision-making, enabling a new layer of interaction between space, technology, and commerce.",
    overview:
      "This system was developed to close the gap between physical retail environments and digital decision engines. It combines sensor fusion with real-time behavioral modeling to adapt commercial spaces to visitor context, validated across three pilot deployments.",
    patentNumber: "GB2024-0091X",
    patentNumberKind: "patent",
    filedDate: "2024-01-15",
    grantedDate: "2024-11-01",
    readinessStage: 3,
    relatedPublications: publications.filter(
      (p) => p.relatedProjectSlug === "adaptive-interaction",
    ),
    featured: true,
    visible: true,
  },
  {
    _id: "project-aerial-coordination",
    title: "Distributed semi-autonomous aerial coordination platform",
    slug: "aerial-coordination",
    status: "pending",
    researchDomain: autonomous,
    shortDescription:
      "A coordination system for distributed aerial platforms capable of operating safely and efficiently within complex urban and public environments.",
    overview:
      "The platform coordinates multiple semi-autonomous aerial units using a shared decision layer, allowing safe operation in constrained urban airspace. Current work focuses on failure-mode validation ahead of full patent grant.",
    patentNumberKind: "application",
    filedDate: "2026-03-01",
    readinessStage: 2,
    relatedPublications: publications.filter(
      (p) => p.relatedProjectSlug === "aerial-coordination",
    ),
    featured: false,
    visible: true,
  },
  {
    _id: "project-behavioral-engine",
    title:
      "Real-time behavioral interpretation engine for intelligent systems",
    slug: "behavioral-engine",
    status: "licensing",
    researchDomain: cyberPhysical,
    shortDescription:
      "A system that interprets human behavior and environmental signals in real time, ready for commercial integration through direct licensing.",
    overview:
      "A granted, production-validated engine for interpreting behavioral and environmental signals in real time. Already integrated in two pilot deployments and open for licensing by qualified commercial partners.",
    patentNumber: "GB2023-0044P",
    patentNumberKind: "patent",
    filedDate: "2023-06-01",
    grantedDate: "2024-02-01",
    readinessStage: 3,
    relatedPublications: publications.filter(
      (p) => p.relatedProjectSlug === "behavioral-engine",
    ),
    featured: false,
    visible: true,
  },
];

import type { Publication } from "@/lib/types";

export const publications: Publication[] = [
  {
    _id: "pub-behavioral-interpretation",
    title:
      "Real-time behavioral signal interpretation in cyber-physical environments",
    venue: "SSRN",
    year: 2026,
    abstract:
      "This preprint presents a framework for interpreting behavioral and environmental signals in real time within cyber-physical systems, combining sensor fusion with decision models intended for real-world deployment analysis. The work describes the underlying research and concept development phase rather than completed prototype validation.",
    relatedProjectSlug: "behavioral-engine",
    visible: true,
  },
  {
    _id: "pub-aerial-coordination",
    title: "Coordination models for distributed semi-autonomous aerial platforms",
    venue: "SSRN",
    year: 2025,
    abstract:
      "This preprint introduces a coordination concept for distributed semi-autonomous aerial platforms operating in constrained urban airspace. The model focuses on architecture, shared decision logic, and failure-mode planning as a basis for future prototype engineering and validation work.",
    relatedProjectSlug: "aerial-coordination",
    visible: true,
  },
  {
    _id: "pub-hybrid-interaction",
    title:
      "Hybrid physical–digital interaction: a framework for commercial environments",
    venue: "SSRN",
    year: 2025,
    abstract:
      "This preprint proposes a framework for hybrid physical–digital interaction in commercial environments, integrating sensor fusion with real-time behavioral modeling to study context-aware interaction design and architecture before prototype construction and validation.",
    relatedProjectSlug: "adaptive-interaction",
    visible: true,
  },
];

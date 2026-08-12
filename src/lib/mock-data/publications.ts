import type { Publication } from "@/lib/types";

export const publications: Publication[] = [
  {
    _id: "pub-behavioral-interpretation",
    title:
      "Real-time behavioral signal interpretation in cyber-physical environments",
    venue: "Journal of Applied Systems Research",
    year: 2026,
    abstract:
      "This paper presents a framework for interpreting behavioral and environmental signals in real time within cyber-physical systems, combining sensor fusion with decision models validated across live pilot deployments. We show the proposed interpretation layer reduces response latency while maintaining accuracy under variable environmental conditions.",
    relatedProjectSlug: "behavioral-engine",
    visible: true,
  },
  {
    _id: "pub-aerial-coordination",
    title: "Coordination models for distributed semi-autonomous aerial platforms",
    venue: "International Conference on Autonomous Systems",
    year: 2025,
    abstract:
      "We introduce a coordination model for distributed semi-autonomous aerial platforms operating in constrained urban airspace. The model uses a shared decision layer to manage multi-unit coordination and failure-mode recovery, with results reported from controlled urban trials ahead of full commercial deployment.",
    relatedProjectSlug: "aerial-coordination",
    visible: true,
  },
  {
    _id: "pub-hybrid-interaction",
    title:
      "Hybrid physical–digital interaction: a framework for commercial environments",
    venue: "Techno-Economic Systems Review",
    year: 2025,
    abstract:
      "This work proposes a framework for hybrid physical–digital interaction in commercial environments, integrating sensor fusion with real-time behavioral modeling to adapt physical spaces to visitor context. Findings from three pilot deployments show measurable improvements in space utilization and visitor engagement.",
    relatedProjectSlug: "adaptive-interaction",
    visible: true,
  },
];

import type { PartnershipType } from "@/lib/types";

export const partnershipTypes: PartnershipType[] = [
  {
    _id: "partnership-joint-research",
    name: "Research Collaboration",
    description:
      "Explore research questions, experimental methods, and evidence needed to advance a technology concept.",
    visible: true,
  },
  {
    _id: "partnership-experimental-validation",
    name: "Prototype & Validation",
    description:
      "Contribute specialist engineering, testing environments, or data for a defined prototype and validation scope.",
    visible: true,
  },
  {
    _id: "partnership-technology-licensing",
    name: "Commercial Operation",
    description:
      "Operate a validated technology under a future license while Depth X retains ownership of the assigned intellectual property.",
    visible: true,
  },
];

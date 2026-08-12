import type { PartnershipType } from "@/lib/types";

export const partnershipTypes: PartnershipType[] = [
  {
    _id: "partnership-joint-research",
    name: "Joint Research",
    description:
      "Co-develop new research questions and share experimental infrastructure with our lab.",
    visible: true,
  },
  {
    _id: "partnership-experimental-validation",
    name: "Experimental Validation",
    description:
      "Provide real-world environments or data to help validate a system under development.",
    visible: true,
  },
  {
    _id: "partnership-technology-licensing",
    name: "Technology Licensing",
    description:
      "License a granted patent or validated system for commercial deployment.",
    visible: true,
  },
];

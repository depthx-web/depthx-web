import type { FaqItem } from "@/lib/types";

export const faqItems: FaqItem[] = [
  {
    _id: "faq-patent-owner",
    question: "Who currently owns the patent applications?",
    answer:
      "Both applications are currently filed in founder Marwen Ayadi's name. Following formal grant, the patents are intended to be assigned to Depth X.",
    category: "licensing",
    order: 1,
    visible: true,
  },
  {
    _id: "faq-nda",
    question: "Do you require an NDA before sharing technical details?",
    answer:
      "Yes — full technical documentation is shared only after a mutual NDA is signed, following an initial inquiry and fit assessment.",
    category: "licensing",
    order: 2,
    visible: true,
  },
  {
    _id: "faq-exclusive",
    question: "How will the technologies reach the market?",
    answer:
      "Depth X plans to validate each technology first and then license it to a specialized operating company. The UAV platform is the first commercialization priority.",
    category: "licensing",
    order: 3,
    visible: true,
  },
  {
    _id: "faq-investment-stage",
    question:
      "What stage should a project be at before you'll discuss investment?",
    answer:
      "Depth X is currently pre-prototype on the UAV platform. The next milestones are prototype construction with emQopter, technical validation, and a controlled exhibition pilot.",
    category: "general",
    order: 4,
    visible: true,
  },
];

import type { FaqItem } from "@/lib/types";

export const faqItems: FaqItem[] = [
  {
    _id: "faq-available-for-licensing",
    question: 'What does "Available for Licensing" mean exactly?',
    answer:
      "Depth X is developing structured pathways for technology commercialization and transfer, including patent filing, prototype engineering, and later commercial operating models where appropriate. Each project is assessed on its own technical and legal stage.",
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
    question: "Can licenses be exclusive?",
    answer:
      "Exclusivity is negotiable and depends on the project, market, and proposed terms. This is discussed during the term sheet stage.",
    category: "licensing",
    order: 3,
    visible: true,
  },
  {
    _id: "faq-investment-stage",
    question:
      "What stage should a project be at before you'll discuss investment?",
    answer:
      "We're open to conversations at different project stages, from early concept and system architecture through patent filing, prototype engineering, and later commercialization pathways. Documentation and terms differ by stage.",
    category: "general",
    order: 4,
    visible: true,
  },
];

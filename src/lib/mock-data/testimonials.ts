import type { Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    _id: "testimonial-industrial-partner",
    quote:
      "The validation process was rigorous — by the time we reviewed the licensing terms, the technical due diligence was already done for us.",
    attributionName: "Industrial Partner",
    attributionRole: "Pilot Deployment",
    visible: true,
  },
  {
    _id: "testimonial-investor",
    quote:
      "Depth X's documentation of IP status made our investment committee review straightforward — every project's stage was clear from day one.",
    attributionName: "Early-Stage Investor",
    attributionRole: "",
    visible: true,
  },
  {
    _id: "testimonial-research-lab",
    quote:
      "A rare combination of academic rigor and commercial readiness in the same research team.",
    attributionName: "Research Laboratory Partner",
    attributionRole: "",
    visible: true,
  },
];

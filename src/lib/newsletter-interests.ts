import type { NewsletterInterest } from "@/lib/supabase/database.types";

export const NEWSLETTER_INTERESTS: { value: NewsletterInterest; label: string }[] = [
  { value: "news", label: "Company news & IP milestones" },
  { value: "investment", label: "Investment & licensing opportunities" },
  { value: "research", label: "Research & publications" },
  { value: "partnership", label: "Partnership opportunities" },
];

export const ALL_NEWSLETTER_INTERESTS: NewsletterInterest[] = NEWSLETTER_INTERESTS.map(
  (i) => i.value,
);

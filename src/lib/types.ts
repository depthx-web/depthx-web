// Content types matching the CMS content model in the technical spec (§4).
// lib/content.ts maps these onto the Postgres schema in
// supabase/migrations/0001_init.sql (snake_case columns -> these camelCase
// shapes) when Supabase is configured, or the mock fixtures in
// lib/mock-data/ otherwise — every component in src/app and src/components
// consumes these types either way. `_id` is kept as the identifier field
// name across both backends for continuity; it's not Sanity-specific.

export type ProjectStatus = "granted" | "pending" | "licensing";

export type ReadinessStage = 1 | 2 | 3;

export interface ResearchDomain {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  order: number;
  /** SEO meta keywords — surfaced on the Research page. */
  keywords?: string;
  visible: boolean;
}

export interface Publication {
  _id: string;
  title: string;
  venue: string; // journal / conference name
  year: number;
  abstract: string;
  relatedProjectSlug?: string;
  keywords?: string;
  visible: boolean;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  researchDomain: ResearchDomain;
  shortDescription: string;
  overview: string;
  patentNumber?: string;
  filedDate?: string;
  grantedDate?: string;
  readinessStage: ReadinessStage;
  relatedPublications: Publication[];
  featured: boolean;
  visible: boolean;
  keywords?: string;
  /** Raw HTML for an interactive "product simulator" demo, rendered sandboxed on the detail page. */
  simulatorHtml?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  order: number;
  keywords?: string;
  visible: boolean;
}

export interface NewsPost {
  _id: string;
  title: string;
  tag: string;
  excerpt: string;
  body: string;
  date: string;
  published: boolean;
  slug: string;
  imageUrl?: string;
  keywords?: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  attributionName: string;
  attributionRole: string;
  keywords?: string;
  visible: boolean;
}

export type FaqCategory = "licensing" | "general";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
  keywords?: string;
  visible: boolean;
}

export interface PartnershipType {
  _id: string;
  name: string;
  description: string;
  keywords?: string;
  visible: boolean;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export interface LegalPage {
  _id: string;
  slug: string;
  title: string;
  body: string;
  updatedAt: string;
}

export type ContactRole = "investor" | "researcher" | "company";

export interface SiteStat {
  label: string;
  value: string;
}

export interface TrustBarLogo {
  name: string;
  logoUrl?: string;
  link?: string;
}

export interface SiteSettings {
  heroHeadline: string;
  /** Second line of the hero title, rendered in the brand accent color. */
  heroHeadlineAccent: string;
  heroSubtext: string;
  stats: SiteStat[];
  trustBarLogos: TrustBarLogo[];
  footerText: string;
  contactEmails: Record<ContactRole, string>;
  sectionVisibility: Record<string, boolean>;
}

// Data-access layer. Every export here is async and returns data shaped by
// the types in lib/types.ts. When Supabase is configured (see
// lib/supabase/env.ts), it queries Postgres directly using the public,
// read-only RLS policies in supabase/migrations/0001_init.sql; otherwise it
// falls back to the mock fixtures in lib/mock-data/ so the site fully works
// with zero environment variables. Every page in src/app consumes this file
// only — no component needs to know which backend is active.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { projects as mockProjects } from "@/lib/mock-data/projects";
import { researchDomains as mockResearchDomains } from "@/lib/mock-data/research-domains";
import { publications as mockPublications } from "@/lib/mock-data/publications";
import { teamMembers as mockTeamMembers } from "@/lib/mock-data/team";
import { newsPosts as mockNewsPosts } from "@/lib/mock-data/news";
import { testimonials as mockTestimonials } from "@/lib/mock-data/testimonials";
import { faqItems as mockFaqItems } from "@/lib/mock-data/faq";
import { partnershipTypes as mockPartnershipTypes } from "@/lib/mock-data/partnership-types";
import { siteSettings as mockSiteSettings } from "@/lib/mock-data/site-settings";
import { legalPages as mockLegalPages } from "@/lib/mock-data/legal-pages";
import type {
  FaqItem,
  LegalPage,
  NewsPost,
  PartnershipType,
  Project,
  Publication,
  ResearchDomain,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "@/lib/types";

function supabase(): SupabaseClient {
  return createPublicClient() as unknown as SupabaseClient;
}

// ---------- row -> app-type mappers ----------

function mapResearchDomain(row: Record<string, unknown>): ResearchDomain {
  return {
    _id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    icon: row.icon ? String(row.icon) : undefined,
    order: Number(row.order ?? 0),
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapPublication(row: Record<string, unknown>): Publication {
  const relatedProject = row.related_project as { slug?: string } | null | undefined;
  return {
    _id: String(row.id),
    title: String(row.title),
    venue: String(row.venue ?? ""),
    year: Number(row.year),
    abstract: String(row.abstract ?? ""),
    relatedProjectSlug: relatedProject?.slug,
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapProject(row: Record<string, unknown>): Project {
  const domainRow = row.research_domain as Record<string, unknown> | null;
  const pubs = (row.publications as Record<string, unknown>[] | null) ?? [];
  return {
    _id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    status: row.status as Project["status"],
    researchDomain: domainRow
      ? mapResearchDomain(domainRow)
      : { _id: "", name: "", slug: "", description: "", order: 0, visible: true },
    shortDescription: String(row.short_description ?? ""),
    overview: String(row.overview ?? ""),
    patentNumber: row.patent_number ? String(row.patent_number) : undefined,
    patentNumberKind: row.patent_number_kind === "patent" ? "patent" : "application",
    filedDate: row.filed_date ? String(row.filed_date) : undefined,
    grantedDate: row.granted_date ? String(row.granted_date) : undefined,
    readinessStage: Number(row.readiness_stage) as Project["readinessStage"],
    relatedPublications: pubs.map(mapPublication),
    featured: Boolean(row.featured),
    visible: Boolean(row.visible),
    keywords: row.keywords ? String(row.keywords) : undefined,
    simulatorHtml: row.simulator_html ? String(row.simulator_html) : undefined,
  };
}

function mapTeamMember(row: Record<string, unknown>): TeamMember {
  return {
    _id: String(row.id),
    name: String(row.name),
    role: String(row.role ?? ""),
    bio: String(row.bio ?? ""),
    photoUrl: row.photo_url ? String(row.photo_url) : undefined,
    order: Number(row.order ?? 0),
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapNewsPost(row: Record<string, unknown>): NewsPost {
  return {
    _id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    tag: String(row.tag ?? ""),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    date: String(row.date),
    published: Boolean(row.published),
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    keywords: row.keywords ? String(row.keywords) : undefined,
  };
}

function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    _id: String(row.id),
    quote: String(row.quote),
    attributionName: String(row.attribution_name ?? ""),
    attributionRole: String(row.attribution_role ?? ""),
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapFaqItem(row: Record<string, unknown>): FaqItem {
  return {
    _id: String(row.id),
    question: String(row.question),
    answer: String(row.answer ?? ""),
    category: row.category as FaqItem["category"],
    order: Number(row.order ?? 0),
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapPartnershipType(row: Record<string, unknown>): PartnershipType {
  return {
    _id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    keywords: row.keywords ? String(row.keywords) : undefined,
    visible: row.visible === undefined ? true : Boolean(row.visible),
  };
}

function mapLegalPage(row: Record<string, unknown>): LegalPage {
  return {
    _id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    body: String(row.body ?? ""),
    updatedAt: String(row.updated_at),
  };
}

function mapSiteSettings(row: Record<string, unknown>): SiteSettings {
  return {
    heroHeadline: String(row.hero_headline ?? ""),
    heroHeadlineAccent: String(row.hero_headline_accent ?? ""),
    heroSubtext: String(row.hero_subtext ?? ""),
    logoUrl: row.logo_url ? String(row.logo_url) : undefined,
    stats: (row.stats as SiteSettings["stats"]) ?? [],
    trustBarLogos: (row.trust_bar_logos as SiteSettings["trustBarLogos"]) ?? [],
    footerText: String(row.footer_text ?? ""),
    contactEmails: {
      investor: String(row.contact_email_investor ?? ""),
      researcher: String(row.contact_email_researcher ?? ""),
      company: String(row.contact_email_company ?? ""),
    },
    sectionVisibility: (row.section_visibility as Record<string, boolean>) ?? {},
  };
}

const PROJECT_SELECT = "*, research_domain:research_domains(*), publications(*)";

// ---------- public data-access functions ----------

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabaseConfig) return mockSiteSettings;
  const db = await supabase();
  const { data } = await db.from("site_settings").select("*").eq("id", 1).single();
  return data ? mapSiteSettings(data) : mockSiteSettings;
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseConfig) return mockProjects.filter((p) => p.visible);
  const db = await supabase();
  const { data } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("visible", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapProject);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  if (!hasSupabaseConfig) return mockProjects.find((p) => p.slug === slug && p.visible);
  const db = await supabase();
  const { data } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("visible", true)
    .single();
  return data ? mapProject(data) : undefined;
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const visible = await getProjects();
  return visible.find((p) => p.featured) ?? visible[0];
}

export async function getResearchDomains(): Promise<ResearchDomain[]> {
  if (!hasSupabaseConfig) {
    return [...mockResearchDomains].filter((d) => d.visible).sort((a, b) => a.order - b.order);
  }
  const db = await supabase();
  const { data } = await db
    .from("research_domains")
    .select("*")
    .eq("visible", true)
    .order("order", { ascending: true });
  return (data ?? []).map(mapResearchDomain);
}

export async function getPublications(): Promise<Publication[]> {
  if (!hasSupabaseConfig) return mockPublications.filter((p) => p.visible);
  const db = await supabase();
  const { data } = await db
    .from("publications")
    .select("*, related_project:projects(slug)")
    .eq("visible", true)
    .order("year", { ascending: false });
  return (data ?? []).map(mapPublication);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!hasSupabaseConfig) {
    return [...mockTeamMembers].filter((m) => m.visible).sort((a, b) => a.order - b.order);
  }
  const db = await supabase();
  const { data } = await db
    .from("team_members")
    .select("*")
    .eq("visible", true)
    .order("order", { ascending: true });
  return (data ?? []).map(mapTeamMember);
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  if (!hasSupabaseConfig) {
    return mockNewsPosts.filter((n) => n.published).sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  const db = await supabase();
  const { data } = await db
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });
  return (data ?? []).map(mapNewsPost);
}

export async function getNewsPost(slug: string): Promise<NewsPost | undefined> {
  if (!hasSupabaseConfig) return mockNewsPosts.find((n) => n.slug === slug && n.published);
  const db = await supabase();
  const { data } = await db
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data ? mapNewsPost(data) : undefined;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabaseConfig) return mockTestimonials.filter((t) => t.visible);
  const db = await supabase();
  const { data } = await db.from("testimonials").select("*").eq("visible", true);
  return (data ?? []).map(mapTestimonial);
}

export async function getFaqItems(): Promise<FaqItem[]> {
  if (!hasSupabaseConfig) {
    return [...mockFaqItems].filter((f) => f.visible).sort((a, b) => a.order - b.order);
  }
  const db = await supabase();
  const { data } = await db
    .from("faq_items")
    .select("*")
    .eq("visible", true)
    .order("order", { ascending: true });
  return (data ?? []).map(mapFaqItem);
}

export async function getPartnershipTypes(): Promise<PartnershipType[]> {
  if (!hasSupabaseConfig) return mockPartnershipTypes.filter((p) => p.visible);
  const db = await supabase();
  const { data } = await db.from("partnership_types").select("*").eq("visible", true);
  return (data ?? []).map(mapPartnershipType);
}

export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  if (!hasSupabaseConfig) return mockLegalPages.find((p) => p.slug === slug);
  const db = await supabase();
  const { data } = await db.from("legal_pages").select("*").eq("slug", slug).single();
  return data ? mapLegalPage(data) : undefined;
}

export async function getLegalPages(): Promise<LegalPage[]> {
  if (!hasSupabaseConfig) return mockLegalPages;
  const db = await supabase();
  const { data } = await db.from("legal_pages").select("*").order("title", { ascending: true });
  return (data ?? []).map(mapLegalPage);
}

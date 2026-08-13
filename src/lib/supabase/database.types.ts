// Hand-written to match supabase/migrations/0001_init.sql. Once you have a
// live project, regenerate the authoritative version with:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
//
// Every table needs Row/Insert/Update/Relationships (Relationships can be
// `[]` if you never embed it in a `select()`) — @supabase/supabase-js's
// GenericTable/GenericSchema types require all of these to structurally
// match, and the `public` schema itself needs Tables/Views/Functions.
// Omitting any of them doesn't error here; it silently collapses every
// `.from(...)` call's return type to `never` elsewhere in the app.

export type UserRole = "admin" | "editor";
export type ProjectStatus = "granted" | "pending" | "licensing";
export type PatentNumberKind = "application" | "patent";
export type FaqCategory = "licensing" | "general";
export type EmailCampaignStatus = "draft" | "sent" | "failed" | "scheduled";
export type NewsletterInterest = "news" | "investment" | "research" | "partnership";

type NoRelationships = { Relationships: [] };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; role: UserRole; created_at: string };
        Insert: { id: string; email: string; role?: UserRole };
        Update: { email?: string; role?: UserRole };
      } & NoRelationships;
      research_domains: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string | null;
          order: number;
          keywords: string;
          visible: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["research_domains"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["research_domains"]["Insert"]>;
      } & NoRelationships;
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          status: ProjectStatus;
          research_domain_id: string | null;
          short_description: string;
          overview: string;
          patent_number: string | null;
          patent_number_kind: PatentNumberKind;
          filed_date: string | null;
          granted_date: string | null;
          readiness_stage: number;
          featured: boolean;
          visible: boolean;
          created_at: string;
          keywords: string;
          simulator_html: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      } & NoRelationships;
      publications: {
        Row: {
          id: string;
          title: string;
          venue: string;
          year: number;
          abstract: string;
          related_project_id: string | null;
          keywords: string;
          visible: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["publications"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["publications"]["Insert"]>;
      } & NoRelationships;
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string;
          photo_url: string | null;
          order: number;
          keywords: string;
          visible: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      } & NoRelationships;
      news_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          tag: string;
          excerpt: string;
          body: string;
          date: string;
          published: boolean;
          image_url: string | null;
          keywords: string;
        };
        Insert: Omit<Database["public"]["Tables"]["news_posts"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["news_posts"]["Insert"]>;
      } & NoRelationships;
      testimonials: {
        Row: {
          id: string;
          quote: string;
          attribution_name: string;
          attribution_role: string;
          keywords: string;
          visible: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      } & NoRelationships;
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: FaqCategory;
          order: number;
          keywords: string;
          visible: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["faq_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["faq_items"]["Insert"]>;
      } & NoRelationships;
      partnership_types: {
        Row: { id: string; name: string; description: string; keywords: string; visible: boolean };
        Insert: Omit<Database["public"]["Tables"]["partnership_types"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["partnership_types"]["Insert"]>;
      } & NoRelationships;
      site_settings: {
        Row: {
          id: number;
          hero_headline: string;
          hero_headline_accent: string;
          hero_subtext: string;
          logo_url: string | null;
          stats: { label: string; value: string }[];
          trust_bar_logos: { name: string; logoUrl?: string; link?: string }[];
          footer_text: string;
          contact_email_investor: string;
          contact_email_researcher: string;
          contact_email_company: string;
          section_visibility: Record<string, boolean>;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      } & NoRelationships;
      legal_pages: {
        Row: { id: string; slug: string; title: string; body: string; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["legal_pages"]["Row"], "id" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["legal_pages"]["Row"]>;
      } & NoRelationships;
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contact_messages"]["Row"],
          "id" | "read" | "created_at"
        > & { id?: string; read?: boolean };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
      } & NoRelationships;
      page_views: {
        Row: { id: string; path: string; country: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["page_views"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_views"]["Insert"]>;
      } & NoRelationships;
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          interests: NewsletterInterest[];
        };
        Insert: Omit<
          Database["public"]["Tables"]["newsletter_subscribers"]["Row"],
          "id" | "created_at" | "interests"
        > & { id?: string; interests?: NewsletterInterest[] };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Row"]>;
      } & NoRelationships;
      message_replies: {
        Row: {
          id: string;
          message_id: string;
          body: string;
          sent_by: string | null;
          sent_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["message_replies"]["Row"],
          "id" | "sent_at"
        > & { id?: string; sent_at?: string };
        Update: Partial<Database["public"]["Tables"]["message_replies"]["Row"]>;
      } & NoRelationships;
      email_campaigns: {
        Row: {
          id: string;
          subject: string;
          body: string;
          status: EmailCampaignStatus;
          recipient_count: number;
          created_by: string | null;
          created_at: string;
          sent_at: string | null;
          scheduled_at: string | null;
          audience_interest: NewsletterInterest | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["email_campaigns"]["Row"],
          | "id"
          | "created_at"
          | "status"
          | "recipient_count"
          | "sent_at"
          | "scheduled_at"
          | "audience_interest"
        > & {
          id?: string;
          status?: EmailCampaignStatus;
          recipient_count?: number;
          sent_at?: string | null;
          scheduled_at?: string | null;
          audience_interest?: NewsletterInterest | null;
        };
        Update: Partial<Database["public"]["Tables"]["email_campaigns"]["Row"]>;
      } & NoRelationships;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

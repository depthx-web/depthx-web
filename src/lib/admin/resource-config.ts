// Config-driven CRUD registry. Every content type the Admin Panel can edit
// is one entry here — add a table to supabase/migrations, add one entry
// below, and you get a working list + create + edit UI for it. No new
// pages, no new Server Actions.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Static options for a "select" field. Use `referenceTable` instead for a DB-backed dropdown. */
  options?: { label: string; value: string }[];
  /** For "select" fields whose options come from another table (e.g. project -> research domain). */
  referenceTable?: { table: string; valueColumn: string; labelColumn: string };
  helpText?: string;
}

export interface ResourceConfig {
  slug: string;
  table: string;
  label: string;
  singularLabel: string;
  /** Columns shown in the list view, in order. */
  listColumns: { name: string; label: string }[];
  fields: FieldConfig[];
  orderBy: { column: string; ascending?: boolean };
}

export const RESOURCE_CONFIGS: ResourceConfig[] = [
  {
    slug: "projects",
    table: "projects",
    label: "Projects",
    singularLabel: "Project",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "status", label: "Status" },
      { name: "readiness_stage", label: "Readiness" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, helpText: "Used in the URL: /projects/<slug>" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "Patent Granted", value: "granted" },
          { label: "Patent Pending", value: "pending" },
          { label: "Available for Licensing", value: "licensing" },
        ],
      },
      {
        name: "research_domain_id",
        label: "Research Domain",
        type: "select",
        referenceTable: { table: "research_domains", valueColumn: "id", labelColumn: "name" },
      },
      { name: "short_description", label: "Short Description", type: "textarea", required: true },
      { name: "overview", label: "Overview", type: "textarea", required: true },
      {
        name: "patent_number",
        label: "Patent / Application Number",
        type: "text",
        helpText: "Shown publicly as \"Application No.\" until Status is set to Patent Granted.",
      },
      { name: "filed_date", label: "Filed Date", type: "date" },
      { name: "granted_date", label: "Granted Date", type: "date" },
      {
        name: "readiness_stage",
        label: "Readiness Stage",
        type: "select",
        required: true,
        options: [
          { label: "1 — Validation", value: "1" },
          { label: "2 — IP Filed", value: "2" },
          { label: "3 — Commercial", value: "3" },
        ],
      },
      { name: "featured", label: "Featured (homepage flagship)", type: "boolean" },
      { name: "visible", label: "Visible on public site", type: "boolean" },
      {
        name: "keywords",
        label: "SEO Keywords",
        type: "text",
        helpText: "Comma-separated. Used in this page's <meta name=\"keywords\"> tag.",
      },
      {
        name: "simulator_html",
        label: "Product Simulator (HTML)",
        type: "textarea",
        helpText:
          "Optional. Raw HTML/CSS/JS rendered in a sandboxed frame on the project's public page — scripts run isolated from the rest of the site (no access to cookies or other pages).",
      },
    ],
  },
  {
    slug: "research-domains",
    table: "research_domains",
    label: "Research Domains",
    singularLabel: "Research Domain",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "order", label: "Order" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "order", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "order", label: "Order", type: "number" },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
  {
    slug: "publications",
    table: "publications",
    label: "Publications",
    singularLabel: "Publication",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "venue", label: "Venue" },
      { name: "year", label: "Year" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "year", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "venue", label: "Journal / Conference", type: "text", required: true },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "abstract", label: "Abstract", type: "textarea", required: true },
      {
        name: "related_project_id",
        label: "Related Project",
        type: "select",
        referenceTable: { table: "projects", valueColumn: "id", labelColumn: "title" },
      },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
  {
    slug: "team-members",
    table: "team_members",
    label: "Team",
    singularLabel: "Team Member",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "order", label: "Order" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "order", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea", required: true },
      { name: "photo_url", label: "Photo URL", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
  {
    slug: "news-posts",
    table: "news_posts",
    label: "News",
    singularLabel: "News Post",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "date", label: "Date" },
      { name: "published", label: "Published" },
    ],
    orderBy: { column: "date", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "tag", label: "Tag", type: "text", required: true, helpText: 'e.g. "IP MILESTONE", "RESEARCH"' },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "body", label: "Body", type: "textarea", required: true },
      { name: "image_url", label: "Featured Image URL", type: "text" },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "published", label: "Published", type: "boolean" },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
    ],
  },
  {
    slug: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singularLabel: "Testimonial",
    listColumns: [
      { name: "attribution_name", label: "Attribution" },
      { name: "quote", label: "Quote" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "attribution_name", ascending: true },
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "attribution_name", label: "Attribution Name", type: "text", required: true },
      { name: "attribution_role", label: "Attribution Role", type: "text" },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
  {
    slug: "faq-items",
    table: "faq_items",
    label: "FAQ",
    singularLabel: "FAQ Item",
    listColumns: [
      { name: "question", label: "Question" },
      { name: "category", label: "Category" },
      { name: "order", label: "Order" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "order", ascending: true },
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { label: "Licensing", value: "licensing" },
          { label: "General", value: "general" },
        ],
      },
      { name: "order", label: "Order", type: "number" },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
  {
    slug: "partnership-types",
    table: "partnership_types",
    label: "Partnership Types",
    singularLabel: "Partnership Type",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "visible", label: "Visible" },
    ],
    orderBy: { column: "name", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "keywords", label: "SEO Keywords", type: "text", helpText: "Comma-separated." },
      { name: "visible", label: "Visible on public site", type: "boolean" },
    ],
  },
];

export function getResourceConfig(slug: string): ResourceConfig | undefined {
  return RESOURCE_CONFIGS.find((r) => r.slug === slug);
}

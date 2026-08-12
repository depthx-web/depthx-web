"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireProfile } from "@/lib/admin/auth";
import { getResourceConfig, type FieldConfig } from "@/lib/admin/resource-config";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

// The generic CRUD framework picks its table at runtime from resource-config
// slugs, which a string can't satisfy against Database['public']['Tables']
// (a literal-key union) for full type inference. Drop to the untyped client
// only at these call sites — src/lib/content.ts (the public read layer) uses
// literal table names directly and keeps full typing.
function untypedFrom(client: Awaited<ReturnType<typeof createClient>>) {
  return client as unknown as SupabaseClient;
}

function coerceValue(field: FieldConfig, formData: FormData): string | number | boolean | null {
  if (field.type === "boolean") {
    return formData.get(field.name) === "on";
  }
  const raw = formData.get(field.name);
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value === "") return field.required ? "" : null;
  if (field.type === "number") return Number(value);
  return value;
}

function buildRecord(fields: FieldConfig[], formData: FormData) {
  const record: Record<string, string | number | boolean | null> = {};
  for (const field of fields) {
    record[field.name] = coerceValue(field, formData);
  }
  return record;
}

// PUBLIC_PATHS_BY_RESOURCE: which public routes to revalidate after a write,
// mirroring src/app/api/revalidate/route.ts's PATHS_BY_TYPE mapping.
const PUBLIC_PATHS_BY_RESOURCE: Record<string, string[]> = {
  projects: ["/", "/projects", "/investors"],
  publications: ["/publications"],
  "team-members": ["/team"],
  "news-posts": ["/news"],
  testimonials: ["/investors"],
  "faq-items": ["/investors"],
  "research-domains": ["/", "/research"],
  "partnership-types": ["/collaboration"],
};

// Resources with their own public detail route, keyed by the field that
// holds the slug used in that route's URL.
const DETAIL_ROUTE_BY_RESOURCE: Record<string, string> = {
  projects: "/projects",
  "news-posts": "/news",
};

function revalidatePublicPaths(slug: string, formData?: FormData) {
  (PUBLIC_PATHS_BY_RESOURCE[slug] ?? []).forEach((path) => revalidatePath(path));
  const detailRoute = DETAIL_ROUTE_BY_RESOURCE[slug];
  const recordSlug = formData?.get("slug");
  if (detailRoute && typeof recordSlug === "string" && recordSlug) {
    revalidatePath(`${detailRoute}/${recordSlug}`);
  }
}

export async function createResourceAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireProfile();
  const config = getResourceConfig(slug);
  if (!config) return { error: "Unknown resource" };

  const supabase = await createClient();
  const { error } = await untypedFrom(supabase)
    .from(config.table)
    .insert(buildRecord(config.fields, formData));
  if (error) return { error: error.message };

  revalidatePath(`/admin/${slug}`);
  revalidatePublicPaths(slug, formData);
  redirect(`/admin/${slug}?created=1`);
}

export async function updateResourceAction(
  slug: string,
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireProfile();
  const config = getResourceConfig(slug);
  if (!config) return { error: "Unknown resource" };

  const supabase = await createClient();
  const { error } = await untypedFrom(supabase)
    .from(config.table)
    .update(buildRecord(config.fields, formData))
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath(`/admin/${slug}`);
  revalidatePublicPaths(slug, formData);
  redirect(`/admin/${slug}?updated=1`);
}

export async function deleteResourceAction(slug: string, id: string) {
  await requireProfile();
  const config = getResourceConfig(slug);
  if (!config) throw new Error("Unknown resource");

  const supabase = await createClient();
  const { error } = await untypedFrom(supabase).from(config.table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${slug}`);
  revalidatePublicPaths(slug);
  redirect(`/admin/${slug}?deleted=1`);
}

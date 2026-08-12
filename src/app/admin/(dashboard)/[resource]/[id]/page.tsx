import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { getResourceConfig } from "@/lib/admin/resource-config";
import { loadReferenceOptions } from "@/lib/admin/reference-options";
import { createClient } from "@/lib/supabase/server";
import { ResourceForm } from "@/components/admin/resource-form";
import { updateResourceAction } from "@/app/admin/actions/resource";

export async function generateMetadata(
  props: PageProps<"/admin/[resource]/[id]">,
): Promise<Metadata> {
  const { resource } = await props.params;
  const config = getResourceConfig(resource);
  return { title: config ? `Edit ${config.singularLabel}` : "Not found" };
}

export default async function EditResourcePage(props: PageProps<"/admin/[resource]/[id]">) {
  const { resource, id } = await props.params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const supabase = await createClient();
  const untyped = supabase as unknown as SupabaseClient;
  const [{ data: row }, referenceOptions] = await Promise.all([
    untyped.from(config.table).select("*").eq("id", id).single(),
    loadReferenceOptions(untyped, config),
  ]);
  if (!row) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: config.label, href: `/admin/${config.slug}` },
          { label: `Edit ${config.singularLabel}` },
        ]}
      />
      <h1 className="mb-6 font-display text-2xl font-semibold">Edit {config.singularLabel}</h1>
      <ResourceForm
        config={config}
        initialValues={row}
        referenceOptions={referenceOptions}
        action={updateResourceAction.bind(null, config.slug, id)}
        submitLabel="Save Changes"
      />
    </div>
  );
}

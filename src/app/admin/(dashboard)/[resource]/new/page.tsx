import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { getResourceConfig } from "@/lib/admin/resource-config";
import { loadReferenceOptions } from "@/lib/admin/reference-options";
import { createClient } from "@/lib/supabase/server";
import { ResourceForm } from "@/components/admin/resource-form";
import { createResourceAction } from "@/app/admin/actions/resource";

export async function generateMetadata(
  props: PageProps<"/admin/[resource]/new">,
): Promise<Metadata> {
  const { resource } = await props.params;
  const config = getResourceConfig(resource);
  return { title: config ? `New ${config.singularLabel}` : "Not found" };
}

export default async function NewResourcePage(props: PageProps<"/admin/[resource]/new">) {
  const { resource } = await props.params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const supabase = await createClient();
  const referenceOptions = await loadReferenceOptions(
    supabase as unknown as SupabaseClient,
    config,
  );

  return (
    <div>
      <Breadcrumbs items={[{ label: config.label, href: `/admin/${config.slug}` }, { label: `New ${config.singularLabel}` }]} />
      <h1 className="mb-6 font-display text-2xl font-semibold">New {config.singularLabel}</h1>
      <ResourceForm
        config={config}
        referenceOptions={referenceOptions}
        action={createResourceAction.bind(null, config.slug)}
        submitLabel={`Create ${config.singularLabel}`}
      />
    </div>
  );
}

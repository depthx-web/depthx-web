import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getResourceConfig } from "@/lib/admin/resource-config";
import { createClient } from "@/lib/supabase/server";
import { ResourceTable } from "@/components/admin/resource-table";
import { SuccessBanner } from "@/components/admin/success-banner";

export async function generateMetadata(
  props: PageProps<"/admin/[resource]">,
): Promise<Metadata> {
  const { resource } = await props.params;
  const config = getResourceConfig(resource);
  return { title: config?.label ?? "Not found" };
}

export default async function ResourceListPage(props: PageProps<"/admin/[resource]">) {
  const { resource } = await props.params;
  const searchParams = await props.searchParams;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const supabase = await createClient();
  const { data, error } = await (supabase as unknown as SupabaseClient)
    .from(config.table)
    .select("*")
    .order(config.orderBy.column, { ascending: config.orderBy.ascending ?? true });

  const status = typeof searchParams.created !== "undefined"
    ? "created"
    : typeof searchParams.updated !== "undefined"
      ? "updated"
      : typeof searchParams.deleted !== "undefined"
        ? "deleted"
        : undefined;

  return (
    <div>
      <SuccessBanner status={status} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">{config.label}</h1>
        <Link
          href={`/admin/${config.slug}/new`}
          className="rounded-md bg-green px-4 py-2 text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4]"
        >
          + Add {config.singularLabel}
        </Link>
      </div>
      {error ? (
        <p className="text-sm text-amber">{error.message}</p>
      ) : (
        <ResourceTable config={config} rows={data ?? []} />
      )}
    </div>
  );
}

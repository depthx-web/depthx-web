import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { LegalPageForm } from "./legal-page-form";

export async function generateMetadata(
  props: PageProps<"/admin/legal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: `Edit ${slug}` };
}

export default async function EditLegalPage(props: PageProps<"/admin/legal/[slug]">) {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/admin");

  const { slug } = await props.params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("legal_pages").select("*").eq("slug", slug).single();
  if (!page) notFound();

  return (
    <div>
      <Breadcrumbs items={[{ label: "Legal Pages", href: "/admin/legal" }, { label: page.title }]} />
      <h1 className="mb-6 font-display text-2xl font-semibold">Edit {page.title}</h1>
      <LegalPageForm slug={page.slug} title={page.title} body={page.body} />
    </div>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { CustomerDiscoveryForm } from "@/components/interviews/customer-discovery-form";
import { getCurrentProfile } from "@/lib/admin/auth";

export const metadata: Metadata = pageMetadata({
  title: "Interviews",
  description: "Capture exhibition and customer discovery interview data for the Depth X team.",
  path: "/interview",
});

export default async function InterviewPage() {
  const profile = await getCurrentProfile();
  return <CustomerDiscoveryForm adminView={profile?.role === "admin"} />;
}

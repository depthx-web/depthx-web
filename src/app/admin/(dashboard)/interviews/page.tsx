import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { CustomerDiscoveryForm } from "@/components/interviews/customer-discovery-form";

export const metadata: Metadata = { title: "Interviews" };

export default async function AdminInterviewsPage() {
  await requireAdmin();

  return <CustomerDiscoveryForm adminView={true} />;
}

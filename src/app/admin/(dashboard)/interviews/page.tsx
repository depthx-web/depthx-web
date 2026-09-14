import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { AdminInterviewDashboard } from "@/components/interviews/admin-interview-dashboard";

export const metadata: Metadata = { title: "Interview Analytics" };

export default async function AdminInterviewsPage() {
  await requireAdmin();

  return <AdminInterviewDashboard />;
}

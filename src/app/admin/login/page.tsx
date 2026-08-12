import type { Metadata } from "next";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { SupabaseNotConnected } from "@/components/admin/not-connected";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  if (!hasSupabaseConfig) return <SupabaseNotConnected />;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-8 py-20">
      <div className="mb-8 text-center">
        <div className="font-display text-xl font-bold">
          Depth<span className="text-amber">X</span>
        </div>
        <p className="mt-2 text-sm text-muted">Sign in to the Admin Panel</p>
      </div>
      <LoginForm />
    </div>
  );
}

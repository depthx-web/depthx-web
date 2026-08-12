"use client";

import { useState } from "react";
import type { ContactRole } from "@/lib/types";
import { RoleToggle } from "@/components/contact/role-toggle";
import { ContactForm } from "@/components/contact/contact-form";

/** Toggle + form, kept in sync — used on the Contact page (spec §3 /contact). */
export function ContactSection({
  emails,
  showRoleToggle = true,
  showForm = true,
}: {
  emails: Record<ContactRole, string>;
  showRoleToggle?: boolean;
  showForm?: boolean;
}) {
  const [role, setRole] = useState<ContactRole>("investor");

  return (
    <>
      {showRoleToggle && <RoleToggle emails={emails} value={role} onChange={setRole} />}
      {showForm && <ContactForm role={role} onRoleChange={setRole} />}
    </>
  );
}

"use client";

import { useRef } from "react";
import { updateUserRoleAction } from "@/app/admin/actions/users";
import type { UserRole } from "@/lib/supabase/database.types";

export function RoleSelect({ userId, role }: { userId: string; role: UserRole }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = updateUserRoleAction.bind(null, userId);

  return (
    <form ref={formRef} action={action}>
      <select
        name="role"
        defaultValue={role}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-line bg-bg-2 px-3 py-1.5 text-sm text-text"
      >
        <option value="editor">editor</option>
        <option value="admin">admin</option>
      </select>
    </form>
  );
}

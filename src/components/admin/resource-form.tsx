"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions/resource";
import type { FieldConfig, ResourceConfig } from "@/lib/admin/resource-config";

const initialState: ActionState = { error: null };

export function ResourceForm({
  config,
  initialValues,
  referenceOptions,
  action,
  submitLabel,
}: {
  config: ResourceConfig;
  initialValues?: Record<string, unknown>;
  referenceOptions: Record<string, { label: string; value: string }[]>;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      {config.fields.map((field) => (
        <Field key={field.name} field={field} initialValue={initialValues?.[field.name]} options={referenceOptions[field.name] ?? field.options} />
      ))}
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-green px-6 py-3 text-sm font-semibold text-[#06140F] hover:bg-[#5EE6B4] disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  field,
  initialValue,
  options,
}: {
  field: FieldConfig;
  initialValue: unknown;
  options?: { label: string; value: string }[];
}) {
  const inputClass =
    "w-full rounded-md border border-line bg-bg-2 px-3.5 py-3 text-sm text-text focus:border-transparent focus:outline focus:outline-2 focus:outline-blue";

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(initialValue)}
          className="h-4 w-4 accent-green"
        />
        {field.label}
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] tracking-wide text-muted">
        {field.label.toUpperCase()}
        {field.required && <span className="text-amber"> *</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          required={field.required}
          defaultValue={typeof initialValue === "string" ? initialValue : ""}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : field.type === "select" ? (
        <select
          name={field.name}
          required={field.required}
          defaultValue={typeof initialValue === "string" ? initialValue : String(initialValue ?? "")}
          className={inputClass}
        >
          <option value="">—</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
          name={field.name}
          required={field.required}
          defaultValue={
            typeof initialValue === "string" || typeof initialValue === "number"
              ? String(initialValue)
              : ""
          }
          className={inputClass}
        />
      )}
      {field.helpText && <span className="text-xs text-muted">{field.helpText}</span>}
    </label>
  );
}

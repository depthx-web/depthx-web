import Link from "next/link";
import type { ResourceConfig } from "@/lib/admin/resource-config";
import { deleteResourceAction } from "@/app/admin/actions/resource";
import { DeleteButton } from "@/components/admin/delete-button";

export function ResourceTable({
  config,
  rows,
}: {
  config: ResourceConfig;
  rows: Record<string, unknown>[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-bg-2">
            {config.listColumns.map((col) => (
              <th key={col.name} className="px-4 py-3 text-left font-mono text-[11px] text-muted">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={config.listColumns.length + 1} className="px-4 py-8 text-center text-muted">
                No {config.label.toLowerCase()} yet.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={String(row.id)} className="border-b border-line last:border-none hover:bg-hover">
              {config.listColumns.map((col) => (
                <td key={col.name} className="max-w-70 truncate px-4 py-3">
                  {formatCell(row[col.name])}
                </td>
              ))}
              <td className="flex items-center justify-end gap-4 px-4 py-3">
                <Link href={`/admin/${config.slug}/${row.id}`} className="font-mono text-xs text-blue hover:text-text">
                  Edit
                </Link>
                <DeleteButton
                  action={deleteResourceAction.bind(null, config.slug, String(row.id))}
                  label={String(row[config.listColumns[0]?.name] ?? "this item")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

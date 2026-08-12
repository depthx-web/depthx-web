import type { SupabaseClient } from "@supabase/supabase-js";
import type { ResourceConfig } from "@/lib/admin/resource-config";

/** Resolves dropdown options for every "select" field backed by another table. */
export async function loadReferenceOptions(
  supabase: SupabaseClient,
  config: ResourceConfig,
): Promise<Record<string, { label: string; value: string }[]>> {
  const result: Record<string, { label: string; value: string }[]> = {};

  await Promise.all(
    config.fields
      .filter((f) => f.referenceTable)
      .map(async (f) => {
        const ref = f.referenceTable!;
        // Select "*" rather than a templated column list: postgrest-js parses
        // select strings at the type level, and a dynamic template literal
        // (not a string literal) breaks that parser instead of just widening
        // to `string` — https://github.com/supabase/postgrest-js type inference.
        const { data } = await supabase.from(ref.table).select("*");
        result[f.name] = (data ?? []).map((row: Record<string, unknown>) => ({
          value: String(row[ref.valueColumn]),
          label: String(row[ref.labelColumn]),
        }));
      }),
  );

  return result;
}

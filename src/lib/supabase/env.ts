// Supabase uses "publishable"/"secret" key naming going forward (replacing
// the older "anon"/"service_role" terminology — both work interchangeably
// against the same project, Supabase's dashboard may show either label
// depending on when your project was created).

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

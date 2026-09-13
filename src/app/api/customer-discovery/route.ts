import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/env";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function GET() {
  const authClient = await createAuthClient();
  const { data: claims } = await authClient.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("customer_discovery_interviews")
    .select("id, created_at, interview_code, responses")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase interview read error:", error);
    return NextResponse.json({ error: "Unable to load interviews" }, { status: 500 });
  }

  const rows = data || [];
  const codeCounts = new Map<string, number>();
  rows.forEach((row) => {
    if (row.interview_code) {
      codeCounts.set(row.interview_code, (codeCounts.get(row.interview_code) || 0) + 1);
    }
  });

  return NextResponse.json(
    rows.map((row) => ({
      ...(row.responses || {}),
      databaseId: row.id,
      id:
        row.interview_code && codeCounts.get(row.interview_code) === 1
          ? row.interview_code
          : `DX-${row.id.slice(0, 8).toUpperCase()}`,
      createdAt: row.created_at,
      submissionRole: row.responses?.submissionRole === "admin" ? "admin" : "user",
      syncStatus: "synced",
    })),
  );
}

export async function DELETE(request: NextRequest) {
  const authClient = await createAuthClient();
  const { data: claims } = await authClient.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { data: profile } = await authClient
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = (await request.json()) as { password?: string; ids?: string[]; all?: boolean };
  if (!body.password) {
    return NextResponse.json({ error: "Admin password is required" }, { status: 400 });
  }

  const passwordClient = createClient(supabaseUrl, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: verified, error: passwordError } = await passwordClient.auth.signInWithPassword({
    email: profile.email,
    password: body.password,
  });

  if (passwordError || verified.user?.id !== userId) {
    return NextResponse.json({ error: "Incorrect admin password" }, { status: 401 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
  let query = supabase.from("customer_discovery_interviews").delete();
  if (body.all) {
    query = query.not("id", "is", null);
  } else if (ids.length) {
    query = query.in("id", ids);
  } else {
    return NextResponse.json({ error: "Select at least one interview or choose all" }, { status: 400 });
  }

  const { error } = await query;
  if (error) {
    console.error("Supabase interview delete error:", error);
    return NextResponse.json({ error: "Unable to delete interviews" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authClient = await createAuthClient();
    const { data: claims } = await authClient.auth.getClaims();
    const userId = claims?.claims?.sub;
    let submissionRole = "user";

    if (userId) {
      const { data: profile } = await authClient
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      submissionRole = profile?.role === "admin" ? "admin" : "user";
    }

    if (!body.type || !["E", "O", "A", "V"].includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid interviewee type" },
        { status: 400 }
      );
    }

    if (!body.clientUuid) {
      return NextResponse.json(
        { error: "Missing clientUuid" },
        { status: 400 }
      );
    }

    const questionLanguage =
      body.questionLanguage === "de" || body.questionLanguage === "zh"
        ? body.questionLanguage
        : "en";

    const row = {
      client_uuid: body.clientUuid,
      interview_code: createInterviewCode(body.clientUuid),
      exhibition: body.exhibition || null,
      company: body.company || null,
      role: body.role || null,
      interviewee_type: body.type,
      question_language: questionLanguage,

      measurement_pain: toScore(body.measurementPain),
      concept_interest: toScore(body.conceptInterest),
      pilot_potential: toScore(body.pilotPotential),
      pilot_interest: toScore(body.pilotInterest),

      follow_up: body.followUp || null,
      contact: body.contact || null,
      contact_consent: body.contactConsent === true,

      next_action: body.nextAction || null,
      key_insight: body.keyInsight || null,
      biggest_objection: body.biggestObjection || null,

      responses: { ...body, submissionRole },
    };

    let { data, error } = await supabase
      .from("customer_discovery_interviews")
      .upsert(row, {
        onConflict: "client_uuid",
      })
      .select("id, created_at")
      .single();

    if (error?.code === "23514" && questionLanguage === "zh") {
      const fallbackRow = { ...row, question_language: "en" };
      ({ data, error } = await supabase
        .from("customer_discovery_interviews")
        .upsert(fallbackRow, {
          onConflict: "client_uuid",
        })
        .select("id, created_at")
        .single());
    }

    if (error || !data) {
      console.error("Supabase upsert error:", error);

      return NextResponse.json(
        { error: error?.message || "Interview was not saved" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      databaseId: data.id,
      createdAt: data.created_at,
      interviewCode: row.interview_code,
      submissionRole,
    });
  } catch (error) {
    console.error("Customer discovery API error:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

function createInterviewCode(clientUuid: string): string {
  return `DX-${clientUuid.replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

function toScore(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const n = Number(value);

  if (!Number.isInteger(n) || n < 1 || n > 5) {
    return null;
  }

  return n;
}

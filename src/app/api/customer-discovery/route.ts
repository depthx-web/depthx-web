import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const row = {
      client_uuid: body.clientUuid,
      interview_code: body.id || null,
      exhibition: body.exhibition || null,
      company: body.company || null,
      role: body.role || null,
      interviewee_type: body.type,
      question_language: body.questionLanguage || "en",

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

      responses: body,
    };

    const { data, error } = await supabase
      .from("customer_discovery_interviews")
      .upsert(row, {
        onConflict: "client_uuid",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      databaseId: data.id,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("Customer discovery API error:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
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

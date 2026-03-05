import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ApiErrorSchema, ReportRequestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = ReportRequestSchema.parse(body);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        ok: true,
        stored: false,
        requestId: null,
        message:
          "Request validated but not stored (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured)."
      });
    }

    const { data, error } = await supabase
      .from("report_requests")
      .insert({
        email: input.email,
        name: input.name ?? null,
        zip: input.zip ?? null,
        context: input.context ?? null
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        ApiErrorSchema.parse({ error: "Failed to store report request", details: error }),
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      stored: true,
      requestId: data.id,
      message: "Saved. You can now email the full report from your CRM or automation later."
    });
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


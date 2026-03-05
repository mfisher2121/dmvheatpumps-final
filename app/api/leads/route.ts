import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ApiErrorSchema, LeadSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = LeadSchema.parse(body);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        ok: true,
        stored: false,
        leadId: null,
        message:
          "Lead validated but not stored (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured)."
      });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? null,
        zip: lead.zip,
        message: lead.message ?? null,
        source: lead.source ?? "api"
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        ApiErrorSchema.parse({ error: "Failed to store lead", details: error }),
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, stored: true, leadId: data.id });
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ApiErrorSchema, IncentivesQuerySchema } from "@/lib/schemas";
import { buildIncentivesResponse } from "@/lib/incentives";

type HpProgramRow = {
  id: string;
  utility: string;
  state: "DC" | "MD" | "VA" | null;
  program_name: string;
  amount_usd: number | string;
  notes: string | null;
  source_url: string | null;
  updated_at: string | null;
  active: boolean;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = IncentivesQuerySchema.parse({
      state: url.searchParams.get("state") ?? undefined,
      utility: url.searchParams.get("utility") ?? undefined,
      active: url.searchParams.get("active") ?? undefined
    });

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      const resp = buildIncentivesResponse({
        utility: parsed.utility,
        activeOnly: true,
        rows: [],
        disclaimer:
          "No database configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and populate hp_incentive_programs for up-to-date incentives."
      });
      return NextResponse.json(resp);
    }

    let q = supabase
      .from("hp_incentive_programs")
      .select("id,utility,state,program_name,amount_usd,notes,source_url,updated_at,active")
      .eq("utility", parsed.utility);

    if (parsed.state) q = q.eq("state", parsed.state);
    if (parsed.active) q = q.eq("active", true);

    const { data, error } = await q.order("amount_usd", { ascending: false });
    if (error) {
      return NextResponse.json(ApiErrorSchema.parse({ error: "Failed to query incentives", details: error }), {
        status: 500
      });
    }

    const rows = (data ?? []) as unknown as HpProgramRow[];
    const normalized = rows.map((r) => ({
      ...r,
      amount_usd: typeof r.amount_usd === "string" ? Number(r.amount_usd) : r.amount_usd
    }));

    const resp = buildIncentivesResponse({
      utility: parsed.utility,
      activeOnly: Boolean(parsed.active),
      rows: normalized as unknown as Parameters<typeof buildIncentivesResponse>[0]["rows"],
      disclaimer:
        "Always confirm eligibility, caps, and effective dates on official program pages. Amounts shown are the current rows in hp_incentive_programs."
    });

    return NextResponse.json(resp);
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


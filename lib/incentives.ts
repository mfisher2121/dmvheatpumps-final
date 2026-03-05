import type { IncentivesResponse } from "@/lib/schemas";

type HpProgramRow = {
  id: string;
  utility: string;
  state: "DC" | "MD" | "VA" | null;
  program_name: string;
  amount_usd: number;
  notes: string | null;
  source_url: string | null;
  updated_at: string | null;
  active: boolean;
};

export function buildIncentivesResponse(args: {
  utility: string;
  activeOnly: boolean;
  rows: HpProgramRow[];
  disclaimer: string;
}): IncentivesResponse {
  const programs = args.rows.map((r) => ({
    id: r.id,
    utility: r.utility,
    state: r.state ?? undefined,
    programName: r.program_name,
    amountUsd: r.amount_usd,
    notes: r.notes ?? undefined,
    sourceUrl: r.source_url ?? undefined,
    updatedAt: r.updated_at ?? undefined
  }));

  const total = Math.round(programs.reduce((sum, p) => sum + (Number.isFinite(p.amountUsd) ? p.amountUsd : 0), 0));

  return {
    utility: args.utility,
    activeOnly: args.activeOnly,
    totalEstimatedUsd: total,
    programs,
    disclaimer: args.disclaimer
  };
}


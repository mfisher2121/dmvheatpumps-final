import { NextResponse } from "next/server";
import { estimateRebate } from "@/lib/calc";
import { ApiErrorSchema, RebateRequestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = RebateRequestSchema.parse(body);
    const result = estimateRebate(input);
    return NextResponse.json(result);
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


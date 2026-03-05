import { NextResponse } from "next/server";
import { estimateSavings } from "@/lib/calc";
import { ApiErrorSchema, SavingsRequestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = SavingsRequestSchema.parse(body);
    const result = estimateSavings(input);
    return NextResponse.json(result);
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


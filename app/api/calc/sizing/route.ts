import { NextResponse } from "next/server";
import { estimateSizing } from "@/lib/calc";
import { ApiErrorSchema, SizingRequestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = SizingRequestSchema.parse(body);
    const result = estimateSizing(input);
    return NextResponse.json(result);
  } catch (err) {
    const payload = ApiErrorSchema.parse({
      error: "Invalid request",
      details: err
    });
    return NextResponse.json(payload, { status: 400 });
  }
}


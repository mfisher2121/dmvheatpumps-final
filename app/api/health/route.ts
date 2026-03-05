import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dmvheatpumps",
    time: new Date().toISOString()
  });
}


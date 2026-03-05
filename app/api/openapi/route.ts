import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "openapi.yaml");
  const yaml = await readFile(filePath, "utf8");
  return new NextResponse(yaml, {
    status: 200,
    headers: {
      "content-type": "application/yaml; charset=utf-8"
    }
  });
}


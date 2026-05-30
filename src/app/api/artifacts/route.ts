import { NextRequest, NextResponse } from "next/server";
import { listArtifacts, createArtifact } from "@/lib/db";
import { seed } from "@/lib/seed";
import { validateArtifact } from "@/lib/validate";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  seed();
  const sp = req.nextUrl.searchParams;
  const items = listArtifacts({
    type: sp.get("type") || undefined,
    q: sp.get("q") || undefined,
    sort: (sp.get("sort") as "popular" | "recent" | "stars" | "name") || undefined,
  });
  return NextResponse.json({ count: items.length, items });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = validateArtifact(body);
  if (!result.ok || !result.value) {
    return NextResponse.json({ error: "Validation failed", details: result.errors }, { status: 422 });
  }
  const artifact = createArtifact(result.value);
  return NextResponse.json({ artifact }, { status: 201 });
}

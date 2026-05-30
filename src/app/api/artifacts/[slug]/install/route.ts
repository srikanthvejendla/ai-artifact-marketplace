import { NextRequest, NextResponse } from "next/server";
import { incrementDownloads } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const downloads = incrementDownloads(slug);
  if (downloads === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ slug, downloads });
}

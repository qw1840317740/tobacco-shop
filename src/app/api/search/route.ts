import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "0") || undefined;

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const results = await searchProducts(query, limit);
  return NextResponse.json(results);
}

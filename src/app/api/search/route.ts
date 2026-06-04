import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const allProducts = await getProducts();
  const results = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.region.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
  );

  return NextResponse.json(results);
}

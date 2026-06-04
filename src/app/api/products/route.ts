import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/data-store";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const prod = await addProduct(body);
  return NextResponse.json(prod, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, ...updates } = body;
  const prod = await updateProduct(id, updates);
  if (!prod) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prod);
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

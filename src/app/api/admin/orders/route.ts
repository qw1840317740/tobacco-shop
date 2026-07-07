import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/admin-auth";
import { getAllOrders, updateOrderStatus } from "@/lib/order-store";

export async function GET(request: NextRequest) {
  const adminSession = await verifySession(request.headers.get("cookie"));
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminSession = await verifySession(request.headers.get("cookie"));
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "パラメータが不足しています" }, { status: 400 });
    }

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "無効なステータス" }, { status: 400 });
    }

    const ok = await updateOrderStatus(orderId, status);
    if (!ok) {
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

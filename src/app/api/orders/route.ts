import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/user-auth";
import { getUserById } from "@/lib/user-store";
import { createOrder, getOrdersByUserId } from "@/lib/order-store";

export async function POST(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, subtotal, shippingFee, tax, total, shippingName, shippingPhone, shippingPostalCode, shippingAddress, paymentMethod, notes } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    // Check age verification
    const user = await getUserById(session.userId);
    if (!user || !user.ageVerified) {
      return NextResponse.json({ error: "年齢確認が必要です" }, { status: 403 });
    }

    const order = await createOrder({
      userId: session.userId,
      items,
      subtotal,
      shippingFee,
      tax,
      total,
      shippingName,
      shippingPhone: shippingPhone || "",
      shippingPostalCode: shippingPostalCode || "",
      shippingAddress,
      paymentMethod: paymentMethod || "bank_transfer",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "注文の作成に失敗しました" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getOrdersByUserId(session.userId);
    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

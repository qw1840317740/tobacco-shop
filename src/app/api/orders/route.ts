import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/user-auth";
import { getUserById } from "@/lib/user-store";
import { createOrder, getOrdersByUserId } from "@/lib/order-store";
import { getProductBySlug } from "@/lib/data-store";
import { validateCoupon } from "@/lib/coupon-store";

export async function POST(request: NextRequest) {
  const session = await verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, shippingName, shippingPhone, shippingPostalCode, shippingAddress, paymentMethod, notes, couponCode } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    // Check age verification
    const user = await getUserById(session.userId);
    if (!user || !user.ageVerified) {
      return NextResponse.json({ error: "年齢確認が必要です" }, { status: 403 });
    }

    // Server-side price recalculation — DO NOT trust client prices
    let subtotal = 0;
    const verifiedItems = [];
    for (const item of items) {
      const product = await getProductBySlug(item.slug);
      if (!product) {
        return NextResponse.json({ error: `商品が見つかりません: ${item.name}` }, { status: 400 });
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      verifiedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Tobacco Business Act Article 36: shipping fees must be paid by the buyer
    // regardless of order amount — no free-shipping threshold.
    const shippingFee = 600;
    const tax = Math.floor(subtotal * 0.1); // 10% tax

    // Apply coupon if provided (server-side validation)
    let couponDiscount = 0;
    if (couponCode && typeof couponCode === "string") {
      const couponResult = validateCoupon(couponCode, subtotal, shippingFee);
      if (couponResult.valid) {
        couponDiscount = couponResult.discount;
      }
    }

    const total = subtotal + shippingFee + tax - couponDiscount;

    const order = await createOrder({
      userId: session.userId,
      items: verifiedItems,
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
      couponCode: couponCode || "",
      couponDiscount,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "注文の作成に失敗しました" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await verifyUserSession(request.headers.get("cookie"));
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

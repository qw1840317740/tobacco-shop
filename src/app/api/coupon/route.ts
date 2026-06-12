import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, shippingFee, usedCoupons } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, discount: 0, type: null, message: "Code is required" },
        { status: 400 }
      );
    }

    const subtotalNum = Number(subtotal) || 0;
    const shippingNum = Number(shippingFee) || 600;
    const usedList: string[] = Array.isArray(usedCoupons) ? usedCoupons : [];

    const result = validateCoupon(code, subtotalNum, shippingNum, usedList);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { valid: false, discount: 0, type: null, message: "Server error" },
      { status: 500 }
    );
  }
}

export interface CouponResult {
  valid: boolean;
  discount: number;
  type: "percentage" | "fixed" | "free_shipping" | null;
  message: string;
  code?: string;
}

interface CouponDef {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minSubtotal?: number;
  oneTime: boolean;
  description: string;
}

const COUPONS: CouponDef[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    oneTime: false,
    description: "10% off your order",
  },
  {
    code: "TOBACCO500",
    type: "fixed",
    value: 500,
    minSubtotal: 3000,
    oneTime: false,
    description: "¥500 off orders over ¥3,000",
  },
  {
    code: "FREE_SHIP",
    type: "free_shipping",
    value: 0,
    oneTime: false,
    description: "Free shipping",
  },
  {
    code: "NEWUSER",
    type: "percentage",
    value: 15,
    oneTime: true,
    description: "15% off for new users (one-time)",
  },
];

export function validateCoupon(
  code: string,
  subtotal: number,
  shippingFee: number,
  usedCoupons: string[] = []
): CouponResult {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS.find((c) => c.code === normalized);

  if (!coupon) {
    return { valid: false, discount: 0, type: null, message: "Invalid promo code" };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      type: null,
      message: `Minimum order of ¥${coupon.minSubtotal.toLocaleString()} required`,
    };
  }

  // Tobacco Business Act Article 36: shipping fees must be paid by the buyer —
  // never waive shipping. Reject any free_shipping coupon.
  if (coupon.type === "free_shipping") {
    return {
      valid: false,
      discount: 0,
      type: null,
      message: "Promo code unavailable (tobacco shipping law)",
    };
  }

  if (coupon.oneTime && usedCoupons.includes(coupon.code)) {
    return {
      valid: false,
      discount: 0,
      type: null,
      message: "This code has already been used",
    };
  }

  let discount = 0;

  switch (coupon.type) {
    case "percentage":
      discount = Math.floor(subtotal * (coupon.value / 100));
      break;
    case "fixed":
      discount = coupon.value;
      break;
    // "free_shipping" is rejected above — never reaches here
  }

  return {
    valid: true,
    discount,
    type: coupon.type,
    message: coupon.description,
    code: coupon.code,
  };
}

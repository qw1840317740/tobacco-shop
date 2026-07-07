"use client";

import { useTranslations } from "next-intl";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Tobacco Business Act Article 36 — shipping is always paid by the buyer.
// Single flat rate shown to keep the preview honest.
const SHIPPING_FEE = 600;
const TAX_RATE = 0.1;

function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("common");
  const { removeItem, updateQuantity } = useCartStore();
  const [imageBroken, setImageBroken] = useState(false);

  const handleDecrement = () => {
    const r = updateQuantity(item.productId, item.quantity - 1);
    if (!r.ok) toast.error("数量の上限に達しました");
  };
  const handleIncrement = () => {
    const r = updateQuantity(item.productId, item.quantity + 1);
    if (!r.ok) toast.error(t("cartMaxReached") || "数量の上限に達しました");
  };

  return (
    <div className="flex gap-3 py-3">
      <Link
        href={`/products/${item.slug}`}
        onClick={() => useUIStore.getState().setCartOpen(false)}
        className="aspect-[3/4] h-16 flex-shrink-0 overflow-hidden rounded-md bg-[#F5F5F5]"
      >
        {item.image && !imageBroken ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={() => setImageBroken(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#888]">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <Link
          href={`/products/${item.slug}`}
          onClick={() => useUIStore.getState().setCartOpen(false)}
          className="text-sm font-medium text-[#1A1A1A] line-clamp-1 hover:text-[#C8A97E] transition-colors"
        >
          {item.name}
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          <button
            onClick={handleDecrement}
            aria-label={t("decrease") || "減らす"}
            disabled={item.quantity <= 1}
            className="flex h-6 w-6 items-center justify-center rounded border border-[#E5E5E5] text-[#888] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[24px] text-center text-xs font-medium text-[#1A1A1A] tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            aria-label={t("increase") || "増やす"}
            disabled={item.quantity >= item.maxQuantity}
            className="flex h-6 w-6 items-center justify-center rounded border border-[#E5E5E5] text-[#888] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus className="h-3 w-3" />
          </button>
          <span className="text-[10px] text-[#888]">/ {item.maxQuantity}</span>
          <button
            onClick={() => removeItem(item.productId)}
            aria-label={t("remove") || "削除"}
            className="ml-auto text-[10px] text-[#888] hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <span className="text-sm font-semibold text-[#C8A97E] tabular-nums">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}

export default function CartDrawer() {
  const tCommon = useTranslations("common");
  const tCheckout = useTranslations("checkout");
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();

  const subtotal = totalPrice();
  const shipping = items.length === 0 ? 0 : SHIPPING_FEE;
  const tax = Math.floor(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {tCommon("cart")}
              {totalItems() > 0 && (
                <span className="rounded-lg bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#888]">
                  {totalItems()}
                </span>
              )}
            </span>
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(tCommon("clearCartConfirm") || "カートを空にしますか？")) {
                    clearCart();
                    toast.success(tCommon("clearedCart") || "カートを空にしました");
                  }
                }}
                className="flex items-center gap-1 text-[10px] text-[#888] hover:text-red-500 transition-colors"
                aria-label={tCommon("clearCart") || "カートを空にする"}
              >
                <Trash2 className="h-3 w-3" />
                {tCommon("clearCart") || "カートを空にする"}
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <p className="text-sm text-[#888]">{tCommon("emptyCart")}</p>
            <Link
              href="/products"
              onClick={() => setCartOpen(false)}
              className="inline-flex h-9 items-center rounded-lg bg-[#1A1A1A] px-4 text-xs font-medium text-white uppercase tracking-wider hover:bg-[#333] transition-colors"
            >
              {tCommon("continueShopping") || "商品を探す"}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <Separator className="my-3" />

            {/* Price breakdown — show what they'll actually pay at checkout */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#888]">
                <span>{tCommon("subtotal")}</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>{tCheckout("shippingFee") || "送料"}</span>
                <span className="tabular-nums">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>{tCheckout("tax") || "消費税"}</span>
                <span className="tabular-nums">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold text-[#1A1A1A]">
                <span>{tCheckout("total") || "合計"}</span>
                <span className="text-[#C8A97E] tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Tobacco law reminder */}
            <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-[#888]">
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" strokeWidth={1.5} />
              {tCommon("cartShippingNote") || "送料はご購入者負担（たばこ事業法第36条）"}
            </p>

            <div className="mt-3 space-y-2">
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1A1A1A] px-2.5 text-sm font-medium text-white uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                {tCommon("checkout")}
              </Link>
              <button
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
              >
                {tCommon("continueShopping") || "買い物を続ける"}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

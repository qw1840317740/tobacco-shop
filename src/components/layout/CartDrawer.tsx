"use client";

import { useTranslations } from "next-intl";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";

function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("common");
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-3 py-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[#F5F5F5]">
        {item.image && (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{item.name}</span>
        <div className="mt-1 flex items-center gap-2">
          <select
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            className="rounded-lg border border-[#E5E5E5] px-1 py-0.5 text-xs text-[#1A1A1A]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-xs text-[#888] hover:text-[#1A1A1A] transition-colors"
          >
            {t("remove")}
          </button>
        </div>
      </div>
      <span className="text-sm font-semibold text-[#C8A97E]">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}

export default function CartDrawer() {
  const t = useTranslations("common");
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, totalPrice, totalItems } = useCartStore();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {t("cart")}
            {totalItems() > 0 && (
              <span className="rounded-lg bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#888]">
                {totalItems()}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-[#888]">{t("emptyCart")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">{t("subtotal")}</span>
                <span className="font-semibold text-[#1A1A1A]">{formatPrice(totalPrice())}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center bg-[#1A1A1A] px-2.5 text-sm font-medium text-white uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                {t("checkout")}
              </Link>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
              >
                {t("continueShopping")}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

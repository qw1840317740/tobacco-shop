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
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-stone-100">
        {item.image && (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium line-clamp-1">{item.name}</span>
        <div className="mt-1 flex items-center gap-2">
          <select
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            className="rounded border border-stone-200 px-1 py-0.5 text-xs"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-xs text-stone-400 hover:text-red-500"
          >
            {t("remove")}
          </button>
        </div>
      </div>
      <span className="text-sm font-semibold text-primary">
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
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {totalItems()}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-stone-400">{t("emptyCart")}</p>
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
                <span>{t("subtotal")}</span>
                <span className="font-semibold">{formatPrice(totalPrice())}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-white hover:bg-primary/90"
              >
                {t("checkout")}
              </Link>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted hover:text-foreground"
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

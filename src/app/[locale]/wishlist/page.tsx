"use client";

import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const hydrated = useWishlistStore((s) => s._hydrated);
  const removeWishlist = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();

  const handleAddToCart = (item: typeof items[number]) => {
    addItem({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(tCommon("addedToCartToast", { name: item.name, qty: 1 }));
  };

  const handleRemove = (id: string) => {
    removeWishlist(id);
    toast.success(tCommon("removedFromWishlist"));
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">
        {tCommon("wishlist")}
        {items.length > 0 && (
          <span className="ml-3 text-base font-normal text-[#888]">({items.length})</span>
        )}
      </h1>

      {!hydrated ? (
        <p className="mt-8 text-center text-[#888]">{tCommon("loading")}</p>
      ) : items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[#888]">{tCommon("wishlistEmpty")}</p>
          <Link href="/products" className="mt-4 inline-block text-[#C8A97E] hover:underline">
            {tCommon("viewProducts")} →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4 p-4">
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-[#F5F5F5]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-sm hover:text-[#C8A97E] block truncate">
                  {getLocalizedName(item, locale)}
                </Link>
                <p className="mt-1 text-lg font-bold text-[#C8A97E]">{formatPrice(item.price)}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  size="sm"
                  className="h-9 bg-[#1A1A1A] text-white hover:bg-[#333] rounded-lg"
                  onClick={() => handleAddToCart(item)}
                >
                  {tCommon("addToCart")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-lg"
                  onClick={() => handleRemove(item.id)}
                >
                  {tCommon("remove")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

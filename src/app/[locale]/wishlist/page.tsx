"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  price: number;
  image: string;
  region: string;
}

const WISHLIST_KEY = "tobacco-shop-wishlist";

function getWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const loadWishlist = useCallback(async () => {
    const ids = getWishlistIds();
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const allProducts: Product[] = await res.json();
        const wishlistItems = allProducts.filter((p) => ids.includes(p.id));
        setItems(wishlistItems);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleAddToCart = (product: Product) => {
    const dn = getLocalizedName(product, locale);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: dn,
      price: product.price,
      image: product.image,
    });
    toast.success(tCommon("addedToCartToast", { name: dn, qty: 1 }));
  };

  const handleRemove = (id: string) => {
    const ids = getWishlistIds().filter((i) => i !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success(tCommon("removedFromWishlist"));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">{tCommon("wishlist")}</h1>
      {loading ? (
        <p className="mt-8 text-center text-[#888888]">{tCommon("loading")}</p>
      ) : items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[#888888]">{tCommon("wishlistEmpty")}</p>
          <Link href="/products" className="mt-4 inline-block text-[#C8A97E] hover:underline">
            {tCommon("viewProducts")} →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => {
            const regionLabel = tProduct(`regions.${item.region}`) || item.region;
            const displayName = getLocalizedName(item, locale);
            return (
              <Card key={item.id} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={displayName} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <Link href={`/products/${item.slug}`} className="font-medium text-sm hover:text-[#C8A97E]">{displayName}</Link>
                  <p className="text-xs text-[#888888]">{regionLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#C8A97E]">{formatPrice(item.price)}</p>
                  <div className="mt-1 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#1A1A1A] text-white hover:bg-[#333]"
                      onClick={() => handleAddToCart(item)}
                    >
                      {tCommon("addToCart")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                    >
                      {tCommon("remove")}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

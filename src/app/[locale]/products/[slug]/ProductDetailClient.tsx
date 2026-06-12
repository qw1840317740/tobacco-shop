"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Star, Minus, Plus, Heart } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import Image from "next/image";

interface Product {
  id: string;
  slug: string;
  code?: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  price: number;
  image: string;
  type: string;
  region: string;
  inStock: boolean;
  sticks: number;
  tar: number;
  nicotine: number;
  desc: string;
}

function deterministicRating(productId: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  hash = Math.abs(hash);
  const rating = 3.5 + (hash % 15) / 10; // 3.5 to 4.9
  const count = 8 + (hash % 93); // 8 to 100
  return { rating: Math.round(rating * 10) / 10, count };
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { add: addRecentlyViewed } = useRecentlyViewed();
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const tNav = useTranslations("nav");
  const tCompliance = useTranslations("compliance");
  const locale = useLocale();

  const displayName = getLocalizedName(product, locale);
  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;
  const { rating, count } = deterministicRating(product.id);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
    toast.success(tCommon("addedToCartToast", { name: displayName, qty }));
  };

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      toast.success(next ? tProduct("addedToWishlist") : tProduct("removedFromWishlist"));
      return next;
    });
  };

  const incrementQty = () => setQty((q) => Math.min(q + 1, 10));
  const decrementQty = () => setQty((q) => Math.max(q - 1, 1));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: tNav("products"), href: "/products" }, { label: displayName }]} />

      {/* Health warning banner */}
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800 leading-relaxed">
        ⚠️ {product.type === "HEATED" ? tCompliance("healthWarningHeated") : tCompliance("healthWarning")}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
          <Image src={product.image} alt={displayName} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {product.code && (
              <Badge className="bg-primary/10 text-primary font-mono">#{product.code}</Badge>
            )}
            <Badge variant="secondary">{regionLabel}</Badge>
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold text-stone-800">{displayName}</h1>

          {/* Star rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : star - 0.5 <= rating
                        ? "fill-amber-400/50 text-amber-400"
                        : "fill-stone-200 text-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-stone-700">{rating.toFixed(1)}</span>
            <span className="text-sm text-stone-400">({count} {tProduct("reviews")})</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          </div>
          <Separator className="my-6" />

          {/* Product specs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">{tProduct("stockStatus")}</span>
              <span className={`text-sm font-semibold ${product.inStock !== false ? "text-green-700" : "text-red-600"}`}>
                {product.inStock !== false ? tCommon("inStock") : tCommon("outOfStock")}
              </span>
            </div>
            {product.sticks > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{tProduct("sticks")}</span>
                <span className="text-sm font-semibold text-stone-700">{product.sticks}{tProduct("sticksUnit")}</span>
              </div>
            )}
            {product.tar > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{tProduct("tar")}</span>
                <span className="text-sm font-semibold text-stone-700">{product.tar} mg</span>
              </div>
            )}
            {product.nicotine > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{tProduct("nicotine")}</span>
                <span className="text-sm font-semibold text-stone-700">{product.nicotine} mg</span>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Quantity stepper + add to cart + wishlist */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-stone-200">
              <button
                onClick={decrementQty}
                disabled={qty <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-l-lg text-stone-500 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-10 items-center justify-center border-x border-stone-200 text-sm font-semibold text-stone-700">
                {qty}
              </span>
              <button
                onClick={incrementQty}
                disabled={qty >= 10}
                className="flex h-10 w-10 items-center justify-center rounded-r-lg text-stone-500 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 bg-primary text-white hover:bg-primary/90"
              disabled={product.inStock === false}
              onClick={handleAdd}
            >
              {tCommon("addToCart")}
            </Button>
            <button
              onClick={handleWishlistToggle}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                isWishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-500"
              }`}
              aria-label={tProduct("addToWishlist")}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">{tProduct("description")}</TabsTrigger>
          <TabsTrigger value="reviews">{tProduct("reviews")}</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <Card className="p-6">
            <p className="leading-relaxed text-stone-600">
              {product.desc || `${displayName}${tProduct("defaultDescription")}`}
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <Card className="p-6 text-center">
            <p className="text-stone-400">{tProduct("noReviews")}</p>
            <Button variant="outline" className="mt-4">{tProduct("writeReview")}</Button>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-stone-800">{tProduct("relatedProducts")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

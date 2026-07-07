"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Minus, Plus, Heart, AlertTriangle } from "lucide-react";
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

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const [qty, setQty] = useState(1);
  const { add: addRecentlyViewed } = useRecentlyViewed();
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const tNav = useTranslations("nav");
  const tCompliance = useTranslations("compliance");
  const locale = useLocale();

  const displayName = getLocalizedName(product, locale);
  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;

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
    const added = toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
    });
    toast.success(added ? tProduct("addedToWishlist") : tProduct("removedFromWishlist"));
  };

  const incrementQty = () => setQty((q) => Math.min(q + 1, 10));
  const decrementQty = () => setQty((q) => Math.max(q - 1, 1));

  return (
    <div>
    <div className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
      <Breadcrumb items={[{ label: tNav("products"), href: "/products" }, { label: displayName }]} />

      {/* Hero image — health warning overlay occupies the bottom 20% (≥15% of the image area)
          per Japanese tobacco compliance convention; uses compliance strings from
          messages/*.json. Pointer-events disabled so the underlying image stays clickable. */}
      <div className="relative mb-6 w-full aspect-square overflow-hidden rounded-lg bg-[#F5F5F5]">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div
          role="note"
          aria-label={tCompliance("healthWarning")}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[20%] items-center justify-center gap-2 bg-red-600/95 px-4 py-2 text-center text-[11px] font-semibold leading-tight text-white sm:text-xs md:text-sm"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2} />
          <span className="line-clamp-3">
            {product.type === "HEATED" ? tCompliance("healthWarningHeated") : tCompliance("healthWarning")}
          </span>
        </div>
      </div>

      {/* Product info below */}
      <div className="py-8">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.code && (
            <span className="bg-[#F5F5F5] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#888] font-mono">
              #{product.code}
            </span>
          )}
          <span className="bg-[#F5F5F5] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#888]">
            {regionLabel}
          </span>
          <span className="bg-[#F5F5F5] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#888]">
            {typeLabel}
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-bold text-[#1A1A1A]">
          {displayName}
        </h1>

        {/* No reviews yet — only real customer reviews are displayed */}
        <p className="mt-3 text-sm text-[#888]">{tProduct("noReviewsShort")}</p>

        <div className="mt-3">
          <span className="text-3xl font-bold text-[#C8A97E]">
            {formatPrice(product.price)}
          </span>
        </div>
        <Separator className="my-6" />

        {/* Product specs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#888]">{tProduct("stockStatus")}</span>
            <span className={`text-sm font-semibold ${product.inStock !== false ? "text-green-700" : "text-red-600"}`}>
              {product.inStock !== false ? tCommon("inStock") : tCommon("outOfStock")}
            </span>
          </div>
          {product.sticks > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888]">{tProduct("sticks")}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{product.sticks}{tProduct("sticksUnit")}</span>
            </div>
          )}
          {product.tar > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888]">{tProduct("tar")}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{product.tar} mg</span>
            </div>
          )}
          {product.nicotine > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888]">{tProduct("nicotine")}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{product.nicotine} mg</span>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Quantity stepper + add to cart + wishlist */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-[#E5E5E5]">
            <button
              onClick={decrementQty}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-l-lg text-[#888] transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-11 w-11 items-center justify-center border-x border-[#E5E5E5] text-sm font-semibold text-[#1A1A1A]">
              {qty}
            </span>
            <button
              onClick={incrementQty}
              disabled={qty >= 10}
              className="flex h-11 w-11 items-center justify-center rounded-r-lg text-[#888] transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            className="h-11 flex-1 bg-[#1A1A1A] text-white rounded-lg uppercase tracking-wider hover:bg-[#333]"
            disabled={product.inStock === false}
            onClick={handleAdd}
          >
            {tCommon("addToCart")}
          </Button>
          <button
            onClick={handleWishlistToggle}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
              wishlisted
                ? "border-[#C8A97E] bg-[#C8A97E]/10 text-[#C8A97E]"
                : "border-[#E5E5E5] text-[#888] hover:border-[#C8A97E] hover:text-[#C8A97E]"
            }`}
            aria-label={tProduct("addToWishlist")}
          >
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-[#C8A97E]" : ""}`} />
          </button>
        </div>
      </div>

      <div>
        <Tabs defaultValue="description" className="mt-4">
          <TabsList>
            <TabsTrigger value="description">{tProduct("description")}</TabsTrigger>
            <TabsTrigger value="reviews">{tProduct("reviews")}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
              <p className="leading-relaxed text-[#1A1A1A]">
                {product.desc || `${displayName}${tProduct("defaultDescription")}`}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6 text-center">
              <p className="text-[#888]">{tProduct("noReviews")}</p>
              <Button variant="outline" className="mt-4">{tProduct("writeReview")}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-16 max-w-[1440px] px-6 py-8 sm:px-10">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A]">
            {tProduct("relatedProducts")}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

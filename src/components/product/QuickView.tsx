"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Star } from "lucide-react";
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
  inStock?: boolean;
  sticks?: number;
  tar?: number;
  nicotine?: number;
}

function deterministicRating(productId: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  hash = Math.abs(hash);
  const rating = 3.5 + (hash % 15) / 10;
  const count = 8 + (hash % 93);
  return { rating: Math.round(rating * 10) / 10, count };
}

interface QuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();

  const displayName = getLocalizedName(product, locale);
  const { rating, count } = deterministicRating(product.id);
  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
    });
    toast.success(tCommon("addedToCartToast", { name: displayName, qty: 1 }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">{tCommon("quickView")}</DialogTitle>
          <DialogDescription className="sr-only">
            {displayName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F5F5F5]">
            <Image
              src={product.image}
              alt={displayName}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
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

            <h3 className="mt-2 text-base font-bold text-[#1A1A1A] leading-snug">
              {displayName}
            </h3>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : star - 0.5 <= rating
                          ? "fill-amber-400/50 text-amber-400"
                          : "fill-stone-200 text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-[#888]">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#888]">({count})</span>
            </div>

            {/* Price */}
            <div className="mt-2">
              <span className="text-xl font-bold text-[#C8A97E]">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Brief specs */}
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">{tProduct("stockStatus")}</span>
                <span
                  className={`font-semibold ${
                    product.inStock !== false
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {product.inStock !== false
                    ? tCommon("inStock")
                    : tCommon("outOfStock")}
                </span>
              </div>
              {product.sticks != null && product.sticks > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#888]">{tProduct("sticks")}</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {product.sticks}{tProduct("sticksUnit")}
                  </span>
                </div>
              )}
              {product.tar != null && product.tar > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#888]">{tProduct("tar")}</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {product.tar} mg
                  </span>
                </div>
              )}
              {product.nicotine != null && product.nicotine > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#888]">{tProduct("nicotine")}</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {product.nicotine} mg
                  </span>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-auto pt-4">
              <Button
                className="h-11 w-full bg-[#1A1A1A] text-white rounded-lg uppercase tracking-wider hover:bg-[#333]"
                disabled={product.inStock === false}
                onClick={handleAdd}
              >
                {tCommon("addToCart")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

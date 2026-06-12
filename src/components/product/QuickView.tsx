"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
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
                <Badge className="bg-primary/10 text-primary font-mono text-[10px]">
                  #{product.code}
                </Badge>
              )}
              <Badge variant="secondary" className="text-[10px]">
                {regionLabel}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {typeLabel}
              </Badge>
            </div>

            <h3 className="mt-2 text-base font-bold text-stone-800 leading-snug">
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
              <span className="text-xs font-medium text-stone-500">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-stone-400">({count})</span>
            </div>

            {/* Price */}
            <div className="mt-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Brief specs */}
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">{tProduct("stockStatus")}</span>
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
                  <span className="text-stone-500">{tProduct("sticks")}</span>
                  <span className="font-semibold text-stone-700">
                    {product.sticks}{tProduct("sticksUnit")}
                  </span>
                </div>
              )}
              {product.tar != null && product.tar > 0 && (
                <div className="flex justify-between">
                  <span className="text-stone-500">{tProduct("tar")}</span>
                  <span className="font-semibold text-stone-700">
                    {product.tar} mg
                  </span>
                </div>
              )}
              {product.nicotine != null && product.nicotine > 0 && (
                <div className="flex justify-between">
                  <span className="text-stone-500">{tProduct("nicotine")}</span>
                  <span className="font-semibold text-stone-700">
                    {product.nicotine} mg
                  </span>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-auto pt-4">
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90"
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

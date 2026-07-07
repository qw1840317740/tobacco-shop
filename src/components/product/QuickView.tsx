"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
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
  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;

  const handleAdd = () => {
    const r = addItem({
      productId: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
      inStock: product.inStock !== false,
    });
    if (!r.ok) {
      if (r.reason === "out_of_stock") toast.error("在庫切れです");
      else if (r.reason === "exceeds_max") toast.error(tCommon("cartMaxReached") || "数量の上限に達しました");
      else toast.error("カートに追加できませんでした");
      return;
    }
    toast.success(tCommon("addedToCartToast", { name: displayName, qty: 1 }));
    onOpenChange(false);
    useUIStore.getState().setCartOpen(true);
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

            {/* No reviews yet — only real customer reviews are displayed */}
            <p className="mt-2 text-xs text-[#888]">{tProduct("noReviewsShort")}</p>

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

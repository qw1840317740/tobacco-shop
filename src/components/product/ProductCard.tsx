"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Star, Eye } from "lucide-react";
import { QuickView } from "@/components/product/QuickView";
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
  desc?: string;
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

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const displayName = getLocalizedName(product, locale);
  const { rating, count } = deterministicRating(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
    });
    toast.success(tCommon("addedToCartToast", { name: displayName, qty: 1 }));
  };

  const regionLabel = tProduct(`regions.${product.region}`) || product.region;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white border border-[#E5E5E5] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-[#F5F5F5]">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />

          {product.inStock === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-[#1A1A1A]">
                {tCommon("outOfStock")}
              </span>
            </div>
          )}

          {/* QuickView eye icon — top-right on hover */}
          {product.inStock !== false && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#1A1A1A] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:text-[#C8A97E]"
              title={tCommon("quickView")}
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-1.5">
          {product.code && (
            <span className="text-[10px] uppercase tracking-wider text-[#888] font-mono">
              #{product.code}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider text-[#888]">
            {regionLabel}
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 text-sm font-medium text-[#1A1A1A] line-clamp-1 transition-colors hover:text-[#C8A97E]">
            {displayName}
          </h3>
        </Link>
        {/* Star rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : star - 0.5 <= rating
                      ? "fill-amber-400/50 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-[#888]">
            {rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#888]">({count})</span>
        </div>
        <div className="mt-2">
          <span className="text-base font-bold text-[#C8A97E]">
            {formatPrice(product.price)}
          </span>
        </div>
        {/* Mobile add */}
        {product.inStock !== false && (
          <button
            onClick={handleAdd}
            className="mt-3 w-full rounded-none bg-[#1A1A1A] py-2 text-xs font-medium text-white uppercase tracking-wider transition-colors hover:bg-[#333] sm:hidden"
          >
            {tCommon("addToCart")}
          </button>
        )}
      </div>
      <QuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}

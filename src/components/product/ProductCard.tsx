"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Star, Eye, Heart } from "lucide-react";
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

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const displayName = getLocalizedName(product, locale);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
    });
    toast.success(added ? tProduct("addedToWishlist") : tProduct("removedFromWishlist"));
  };

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
    <div className="group relative">
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden rounded-lg bg-white border border-[#D4D4D4] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#C8A97E]"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
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

          {/* Wishlist heart — top-left */}
          <button
            onClick={handleWishlist}
            className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300 ${
              wishlisted
                ? "bg-[#C8A97E] text-white opacity-100"
                : "bg-white/90 text-[#1A1A1A] opacity-0 group-hover:opacity-100 hover:bg-white hover:text-[#C8A97E]"
            }`}
            title={wishlisted ? tProduct("removedFromWishlist") : tProduct("addedToWishlist")}
            aria-label={wishlisted ? tProduct("removedFromWishlist") : tProduct("addedToWishlist")}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
          </button>

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
          <h3 className="mt-1.5 text-sm font-medium text-[#1A1A1A] line-clamp-1 transition-colors group-hover:text-[#C8A97E]">
            {displayName}
          </h3>
          {/* No reviews yet — only show real customer reviews, never fabricated ones */}
          <p className="mt-1.5 text-[10px] text-[#888]">{tProduct("noReviewsShort")}</p>
          <div className="mt-2">
            <span className="text-base font-bold text-[#C8A97E]">
              {formatPrice(product.price)}
            </span>
          </div>
          {/* Mobile add — in stock only */}
          {product.inStock !== false && (
            <button
              onClick={handleAdd}
              className="mt-3 w-full rounded-lg bg-[#1A1A1A] py-2 text-xs font-medium text-white uppercase tracking-wider transition-colors hover:bg-[#333] sm:hidden"
            >
              {tCommon("addToCart")}
            </button>
          )}
          {/* Out of stock — disabled pill so the bottom isn't empty */}
          {product.inStock === false && (
            <span className="mt-3 block w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] py-2 text-center text-xs font-medium uppercase tracking-wider text-[#888]">
              {tCommon("outOfStock")}
            </span>
          )}
        </div>
      </Link>
      <QuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}

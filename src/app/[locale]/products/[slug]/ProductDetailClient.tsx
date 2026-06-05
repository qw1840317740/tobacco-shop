"use client";

import { useState } from "react";
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

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const tNav = useTranslations("nav");
  const tCompliance = useTranslations("compliance");
  const locale = useLocale();

  const displayName = getLocalizedName(product, locale);
  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: displayName,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(tCommon("addedToCartToast", { name: displayName, qty }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: tNav("products"), href: "/products" }, { label: displayName }]} />

      {/* Health warning banner */}
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800 leading-relaxed">
        ⚠️ {product.type === "HEATED" ? tCompliance("healthWarningHeated") : tCompliance("healthWarning")}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
          <img src={product.image} alt={displayName} className="h-full w-full object-cover" />
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
          <div className="flex items-center gap-3">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
            >
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <Button
              className="flex-1 bg-primary text-white hover:bg-primary/90"
              disabled={product.inStock === false}
              onClick={handleAdd}
            >
              {tCommon("addToCart")}
            </Button>
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
    </div>
  );
}

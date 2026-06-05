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
import { formatPrice } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";

interface Product {
  id: string;
  slug: string;
  code?: string;
  name: string;
  nameZh?: string;
  price: number;
  image: string;
  type: string;
  region: string;
  inStock: boolean;
  desc: string;
}

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const regionLabel = tProduct(`regions.${product.region}`) || product.region;
  const typeLabel = tProduct(`types.${product.type}`) || product.type;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(tCommon("addedToCartToast", { name: product.name, qty }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: tNav("products"), href: "/products" }, { label: product.name }]} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {product.code && (
              <Badge className="bg-primary/10 text-primary font-mono">#{product.code}</Badge>
            )}
            <Badge variant="secondary">{regionLabel}</Badge>
            <Badge variant="secondary">{typeLabel}</Badge>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold text-stone-800">{product.name}</h1>
          {locale === "zh" && product.nameZh && (
            <p className="mt-1 text-base text-stone-500">{product.nameZh}</p>
          )}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          </div>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">{tProduct("stockStatus")}</span>
              <span className={`text-sm font-semibold ${product.inStock !== false ? "text-green-700" : "text-red-600"}`}>
                {product.inStock !== false ? tCommon("inStock") : tCommon("outOfStock")}
              </span>
            </div>
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
              {product.desc || `${product.name}${tProduct("defaultDescription")}`}
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

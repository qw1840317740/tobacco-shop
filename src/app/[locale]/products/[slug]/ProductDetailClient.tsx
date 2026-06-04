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

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  type: string;
  region: string;
  strength: number;
  inStock: boolean;
  desc: string;
}

function StrengthDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`h-3 w-3 rounded-full ${i <= level ? "bg-primary" : "bg-stone-200"}`} />
      ))}
    </div>
  );
}

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        comparePrice: product.comparePrice,
        image: product.image,
      });
    }
    toast.success(`${product.name} x${qty} をカートに追加しました`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "商品一覧", href: "/products" }, { label: product.name }]} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{product.region}</Badge>
            <Badge variant="secondary">{product.type}</Badge>
            {product.comparePrice && <Badge className="bg-red-100 text-red-700">セール</Badge>}
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold text-stone-800">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-stone-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">濃さ / Strength</span>
              <StrengthDots level={product.strength ?? 3} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">在庫状況</span>
              <span className={`text-sm font-semibold ${product.inStock !== false ? "text-green-700" : "text-red-600"}`}>
                {product.inStock !== false ? "在庫あり" : "在庫切れ"}
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
              カートに追加
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">商品説明</TabsTrigger>
          <TabsTrigger value="reviews">レビュー</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <Card className="p-6">
            <p className="leading-relaxed text-stone-600">
              {product.name}は{product.region}産の高品質なたばこです。豊かな風味と滑らかな吸い心地が特徴で、日本のたばこ愛好家に愛されています。
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <Card className="p-6 text-center">
            <p className="text-stone-400">まだレビューはありません。最初のレビューを書きませんか？</p>
            <Button variant="outline" className="mt-4">レビューを書く</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

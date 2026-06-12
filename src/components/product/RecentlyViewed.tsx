"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";

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
}

const STORAGE_KEY = "tobacco-recently-viewed";
const MAX_ITEMS = 8;

export function RecentlyViewed() {
  const t = useTranslations("common");
  const [products, setProducts] = useState<Product[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setIds(parsed);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (ids.length === 0) return;

    let cancelled = false;

    fetch("/api/products")
      .then((res) => res.json())
      .then((all: Product[]) => {
        if (cancelled) return;
        const idSet = new Set(ids);
        const matched = all.filter((p) => idSet.has(p.id));
        // Preserve the order from localStorage (most recent first)
        const ordered = ids
          .map((id) => matched.find((p) => p.id === id))
          .filter((p): p is Product => p != null);
        setProducts(ordered);
      })
      .catch(() => {
        // ignore fetch errors
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-bold text-stone-800">
        {t("recentlyViewed")}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-44 flex-shrink-0 sm:w-52"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

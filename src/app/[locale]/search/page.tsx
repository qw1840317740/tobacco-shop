"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  type: string;
  region: string;
  inStock?: boolean;
  strength?: number;
  desc?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (q.length <= 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // ignore fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">検索</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="商品を検索..."
          className="flex-1"
          autoFocus
        />
        <Button type="submit" className="bg-primary text-white hover:bg-primary/90">検索</Button>
      </form>
      {loading && (
        <p className="mt-8 text-center text-stone-400">検索中...</p>
      )}
      {!loading && query.length > 1 && results.length === 0 && (
        <p className="mt-8 text-center text-stone-400">「{query}」に一致する商品はありません。</p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

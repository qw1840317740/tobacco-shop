"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  code: string;
  name: string;
  nameEn: string;
  nameZh: string;
  price: number;
  image: string;
  type: string;
  region: string;
  inStock?: boolean;
  desc?: string;
}

export default function SearchPage() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Read initial query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length <= 1) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
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
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="pl-9"
            autoFocus
          />
        </div>
        <Button type="submit" className="bg-primary text-white hover:bg-primary/90">{t("button")}</Button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex flex-col items-center gap-2 text-stone-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-primary" />
          <p className="text-sm">{t("loading")}</p>
        </div>
      )}

      {/* Result count */}
      {!loading && searched && results.length > 0 && (
        <p className="mt-6 text-sm text-stone-500">{t("resultCount", { count: results.length })}</p>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && query.length > 1 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <Search className="h-6 w-6 text-stone-300" />
          </div>
          <p className="text-sm text-stone-400">{t("noResults", { query })}</p>
        </div>
      )}

      {/* Initial empty state */}
      {!searched && !loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <Search className="h-6 w-6 text-stone-300" />
          </div>
          <p className="text-sm text-stone-400">{t("emptyHint")}</p>
        </div>
      )}

      {/* Results grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Search, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getLocalizedName, formatPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  slug: string;
  code: string;
  name: string;
  nameEn: string;
  nameZh: string;
  price: number;
  image: string;
  region: string;
}

export function SearchDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("search");
  const locale = useLocale();

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      if (res.ok) setResults(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/products/${slug}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger icon */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden sm:inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      {/* Expanded search overlay */}
      {open && (
        <div className="absolute right-0 top-0 z-50 flex items-center gap-2 sm:w-96">
          {/* Backdrop on desktop */}
          <div className="relative flex w-full items-center">
            <div className="flex w-full items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-lg">
              <Search className="h-4 w-4 shrink-0 text-stone-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("headerPlaceholder")}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
              {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-stone-400" />}
              {query && !loading && (
                <button onClick={() => { setQuery(""); setResults([]); }} className="shrink-0">
                  <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
                </button>
              )}
            </div>
          </div>

          {/* Dropdown results panel */}
          {query.length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border bg-popover shadow-xl">
              {results.length > 0 ? (
                <>
                  <div className="max-h-80 overflow-y-auto p-1.5">
                    {results.map((p) => {
                      const displayName = getLocalizedName(p, locale);
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelect(p.slug)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                        >
                          {p.image ? (
                            <img src={p.image} alt={displayName} className="h-10 w-10 shrink-0 rounded-md object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-100">
                              <Search className="h-4 w-4 text-stone-300" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {p.code && (
                                <Badge variant="secondary" className="shrink-0 rounded px-1 py-0 text-[9px] font-mono">#{p.code}</Badge>
                              )}
                              <span className="truncate text-sm font-medium">{displayName}</span>
                            </div>
                            <span className="text-xs text-stone-500">{formatPrice(p.price)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t p-1.5">
                    <button
                      onClick={handleViewAll}
                      className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      {t("viewAll")}
                    </button>
                  </div>
                </>
              ) : !loading ? (
                <div className="px-4 py-6 text-center text-sm text-stone-400">
                  {t("noSuggestions")}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

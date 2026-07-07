"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import { getLocalizedName, formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/lib/data-store";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Search, Grid3X3, List, SlidersHorizontal, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";

const ITEMS_PER_PAGE = 12;

type SortOption = "newest" | "priceLow" | "priceHigh";
type ViewMode = "grid" | "list";

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const t = useTranslations("products");
  const tCompliance = useTranslations("compliance");
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [productType, setProductType] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract unique types from products
  const uniqueTypes = useMemo(() => {
    const typeSet = new Set<string>();
    products.forEach((p) => {
      if (p.type) typeSet.add(p.type);
    });
    return Array.from(typeSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) => {
        const name = getLocalizedName(p, locale).toLowerCase();
        return (
          name.includes(q) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          (p.desc && p.desc.toLowerCase().includes(q)) ||
          (p.region && p.region.toLowerCase().includes(q))
        );
      });
    }

    // Category filter
    if (categoryId !== "all") {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    // Type filter
    if (productType !== "all") {
      result = result.filter((p) => p.type === productType);
    }

    // Sort
    switch (sort) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [products, search, categoryId, productType, sort, locale]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  // Reset page when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setProductType(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  // Page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  const hasActiveFilters = search.trim() !== "" || categoryId !== "all" || productType !== "all";

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategoryId("all");
    setProductType("all");
    setCurrentPage(1);
  }, []);

  return (
    <div>
      {/* Site-wide health warning band — TIOJ compliance: required on any page
          that displays tobacco products. Occupies ≥15% of the visible area. */}
      <div role="note" aria-label={tCompliance("healthWarning")} className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-center text-[11px] font-semibold leading-snug text-white sm:text-xs">
        <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span>{tCompliance("healthWarning")}</span>
      </div>

      {/* Filter bar */}
      <div className="mb-6 rounded-lg border border-[#E5E5E5] bg-white">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#E5E5E5]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("filter")}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("grid")}
              className={`rounded-lg p-2 transition-colors ${view === "grid" ? "bg-[#1A1A1A] text-white" : "text-[#888] hover:bg-[#F5F5F5]"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg p-2 transition-colors ${view === "list" ? "bg-[#1A1A1A] text-white" : "text-[#888] hover:bg-[#F5F5F5]"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-wrap items-center gap-3 p-4">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("searchProducts")}
                className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#888] transition-colors focus:border-[#C8A97E] focus:outline-none focus:ring-0"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#888] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] transition-colors focus:border-[#C8A97E] focus:outline-none focus:ring-0"
            >
              <option value="all">{t("allCategories")}</option>
              {categories.map((cat) => {
                const localizedName =
                  locale === "en" && cat.nameEn
                    ? cat.nameEn
                    : locale === "zh" && cat.nameZh
                      ? cat.nameZh
                      : cat.nameJa;
                return (
                  <option key={cat.id} value={cat.id}>
                    {localizedName} ({cat.count})
                  </option>
                );
              })}
            </select>

            {/* Type dropdown */}
            <select
              value={productType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] transition-colors focus:border-[#C8A97E] focus:outline-none focus:ring-0"
            >
              <option value="all">{t("allTypes")}</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "cigarette"
                    ? t("cigarette")
                    : type === "heated"
                      ? t("heated")
                      : type}
                </option>
              ))}
            </select>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] transition-colors focus:border-[#C8A97E] focus:outline-none focus:ring-0"
              >
                <option value="newest">{t("newest")}</option>
                <option value="priceLow">{t("priceLow")}</option>
                <option value="priceHigh">{t("priceHigh")}</option>
              </select>
            </div>

            {/* View toggle (desktop) */}
            <div className="hidden items-center gap-1 lg:flex">
              <button
                onClick={() => setView("grid")}
                className={`rounded-lg p-2 transition-colors ${view === "grid" ? "bg-[#1A1A1A] text-white" : "text-[#888] hover:bg-[#F5F5F5]"}`}
                title={t("gridView")}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-lg p-2 transition-colors ${view === "list" ? "bg-[#1A1A1A] text-white" : "text-[#888] hover:bg-[#F5F5F5]"}`}
                title={t("listView")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-xs font-medium text-[#888] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E]"
              >
                <X className="h-3.5 w-3.5" />
                {t("filter")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#888]">
          {t("showing", {
            count: paginatedProducts.length,
            total: filteredProducts.length,
          })}
        </p>
        <p className="hidden text-xs text-[#888] sm:block">
          {t("page", { current: safeCurrentPage, total: totalPages })}
        </p>
      </div>

      {/* Product grid / list */}
      {paginatedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E5E5E5] bg-[#F5F5F5] px-4 py-20">
          <Search className="mb-4 h-10 w-10 text-[#888]" />
          <p className="text-sm font-medium text-[#1A1A1A]">{t("noResults")}</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs font-medium text-[#C8A97E] hover:underline"
            >
              {t("filter")}
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedProducts.map((product) => (
            <ListProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("previous")}</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-[2.5rem] rounded-lg text-sm font-medium transition-colors ${
                    page === safeCurrentPage
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#888] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              disabled={safeCurrentPage === totalPages}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">{t("next")}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile page info */}
          <p className="text-xs text-[#888] sm:hidden">
            {t("page", { current: safeCurrentPage, total: totalPages })}
          </p>
        </div>
      )}
    </div>
  );
}

// Compact list-view card for products
function ListProductCard({ product, locale }: { product: Product; locale: string }) {
  const displayName = getLocalizedName(product, locale);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-[#E5E5E5] bg-white p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 sm:gap-5 sm:p-4"
    >
      <div className="relative aspect-[3/4] h-20 shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5] sm:h-24">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="96px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-[#1A1A1A] transition-colors group-hover:text-[#C8A97E] sm:text-base">
          {displayName}
        </h3>
        {product.code && (
          <p className="mt-0.5 text-xs font-mono text-[#888]">#{product.code}</p>
        )}
        <p className="mt-1 text-xs text-[#888] line-clamp-1">{product.region}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-bold text-[#C8A97E] sm:text-lg">{formatPrice(product.price)}</p>
        {product.inStock === false && (
          <p className="mt-0.5 text-[10px] font-medium text-[#888]">Out of stock</p>
        )}
      </div>
    </Link>
  );
}

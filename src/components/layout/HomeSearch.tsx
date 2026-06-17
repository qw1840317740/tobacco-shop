"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

/**
 * Homepage search bar — navigates to /search?q=<value>.
 * Rendered server-side in page.tsx after the trust bar.
 */
export function HomeSearch() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="border-b border-[#E5E5E5] bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888]" />
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={tCommon("searchProducts")}
              aria-label={tCommon("searchProducts")}
              className="h-12 w-full rounded-lg border border-[#E5E5E5] bg-white pl-11 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#888] transition-colors focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#C8A97E] px-6 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#B8956A]"
          >
            {tCommon("search")}
          </button>
        </form>
      </div>
    </section>
  );
}

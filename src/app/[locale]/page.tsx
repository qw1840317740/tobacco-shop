import { getTranslations } from "next-intl/server";
import { setRequestLocale, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1502389872488-08725e638945?w=1920&q=80",
  barn: "https://images.unsplash.com/photo-1634922951968-11ca107aa6e3?w=1920&q=80",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "日本製たばこ専門オンラインショップ",
      description:
        "TABACOYA（タバコ屋）は日本製たばこの専門オンラインショップ。JT国内ブランド・国際ブランド・Ploom加熱たばこなど500銘柄以上を厳選してお届けします。",
    },
    en: {
      title: "Premium Japanese Cigarettes Online Shop",
      description:
        "TABACOYA is a specialty online shop for authentic Japanese cigarettes. Browse 500+ curated brands including JT domestic, international, and Ploom heated tobacco.",
    },
    zh: {
      title: "日本制造香烟专营网店",
      description:
        "TABACOYA是日本制造香烟的专营网店。精选JT国内品牌、国际品牌、Ploom加热烟等500种以上的优质香烟。",
    },
  };
  const d = data[locale] ?? data.ja;
  return {
    title: d.title,
    description: d.description,
    openGraph: { title: `${d.title} | TABACOYA`, description: d.description },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tBrands = await getTranslations("brands");

  const [categories, featuredProducts, allProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getProducts(),
  ]);

  const editorsPick = featuredProducts[0] ?? allProducts[0] ?? null;
  const featuredCards = featuredProducts
    .filter((p) => p.id !== editorsPick?.id)
    .slice(0, 5);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO — Split-screen ===== */}
      <section className="relative min-h-[85vh] grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image src={HERO_IMAGES.main} alt="Premium Japanese cigarettes" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-950/60" />
          <div className="absolute bottom-12 left-12 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl shadow-2xl">
            <p className="text-4xl font-heading font-bold text-red-400">500+</p>
            <p className="mt-1 text-sm text-stone-300">{t("heroBrands")}</p>
          </div>
        </div>

        <div className="relative flex items-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 px-8 py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute inset-0 lg:hidden">
            <Image src={HERO_IMAGES.main} alt="" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-black/80" />
          </div>

          <div className="relative max-w-lg">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-primary to-primary/40" />
              <span className="text-xs font-bold tracking-[0.3em] text-primary/70 uppercase">Est. 2001</span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-[1.15] text-white sm:text-5xl">
              {t("heroTitle")}
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                {t("heroTitleHighlight")}
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-400">
              {t("heroDescription")}
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products" className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-red-700 pl-6 pr-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
                {t("heroCtaProducts")}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all group-hover:bg-white/30">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
              <Link href="/guide" className="inline-flex h-12 items-center rounded-full border border-stone-700 bg-white/5 px-6 text-sm font-medium text-stone-300 backdrop-blur-sm transition-all hover:border-stone-500 hover:bg-white/10 hover:text-white">
                {t("heroCtaGuide")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="relative bg-gradient-to-r from-primary via-red-700 to-primary py-2 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="mx-8 text-xs font-bold tracking-widest text-red-100 uppercase">
              {t("marqueeText")}
            </span>
          ))}
        </div>
      </div>

      {/* ===== BRAND SHOWCASE ===== */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-stone-50/80" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-amber-200/20 blur-[100px] animate-pulse" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-blue-200/20 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-60 rounded-full bg-purple-200/15 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Brands</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">{t("brandsTitle")}</h2>
            <p className="mt-2 text-sm text-stone-400">{t("brandsSubtitle")}</p>
          </div>

          {(() => {
            const groups: Record<string, number> = {};
            const gProducts: Record<string, number> = {};
            for (const cat of categories) {
              const g = cat.group || "other";
              groups[g] = (groups[g] || 0) + 1;
              gProducts[g] = (gProducts[g] || 0) + cat.count;
            }

            const groupData = [
              { key: "jt_japan", icon: "🇯🇵", bg: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500", shadow: "shadow-amber-500/25", hoverShadow: "hover:shadow-amber-500/40", label: tBrands("jt_japan"), desc: locale === "en" ? "Premium domestic brands" : locale === "zh" ? "日本本土优质品牌" : "国内プレミアムブランド" },
              { key: "jt_international", icon: "🌍", bg: "bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500", shadow: "shadow-blue-500/25", hoverShadow: "hover:shadow-blue-500/40", label: tBrands("jt_international"), desc: locale === "en" ? "World-famous brands" : locale === "zh" ? "世界知名品牌" : "世界的ブランド" },
              { key: "ploom", icon: "🔥", bg: "bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500", shadow: "shadow-purple-500/25", hoverShadow: "hover:shadow-purple-500/40", label: tBrands("ploom"), desc: locale === "en" ? "Next-gen heated tobacco" : locale === "zh" ? "新一代加热不燃烧" : "次世代加熱たばこ" },
            ];

            return (
              <div className="grid gap-5 sm:grid-cols-3">
                {groupData.map((gd, idx) => {
                  if (!groups[gd.key]) return null;
                  return (
                    <Link key={gd.key} href={`/categories?group=${gd.key}`} className={`group relative overflow-hidden rounded-3xl ${gd.bg} p-[1px] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${gd.shadow} ${gd.hoverShadow}`} style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="relative h-full rounded-3xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-sm p-6 sm:p-8">
                        <div className="absolute -right-3 -top-3 text-5xl opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-125">{gd.icon}</div>
                        <div className="relative">
                          <span className="text-3xl">{gd.icon}</span>
                          <h3 className="mt-3 font-heading text-xl font-bold text-stone-800 transition-colors group-hover:text-primary">{gd.label}</h3>
                          <p className="mt-1 text-sm text-stone-400">{gd.desc}</p>
                          <div className="mt-5 flex items-center gap-3">
                            <div className="rounded-full bg-stone-900/5 px-3 py-1">
                              <span className="text-xs font-bold text-stone-700">{groups[gd.key]} {t("brandsLabel")}</span>
                            </div>
                            <div className="rounded-full bg-primary/10 px-3 py-1">
                              <span className="text-xs font-bold text-primary">{gProducts[gd.key]} {t("items")}</span>
                            </div>
                          </div>
                          <div className="mt-5 flex items-center gap-1 text-xs font-medium text-primary opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                            {t("explore")} →
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}

          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold tracking-wider text-stone-400 uppercase">{t("popularBrands")}</span>
              <Link href="/categories" className="text-xs font-medium text-primary hover:underline">{t("viewAll")} →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories.filter((c) => c.count > 0).sort((a, b) => b.count - a.count).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group flex items-center gap-3 rounded-2xl border border-stone-200/50 bg-white px-4 py-3.5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary transition-all duration-300 group-hover:from-primary group-hover:to-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/25">
                    {cat.nameJa.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-stone-700 group-hover:text-primary transition-colors truncate">
                      {locale === "en" && cat.nameEn ? cat.nameEn : locale === "zh" && cat.nameZh ? cat.nameZh : cat.nameJa}
                    </span>
                    <span className="block text-[11px] text-stone-400">{cat.count} {t("items")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Featured</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">{t("featuredTitle")}</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
              {t("viewAll")} <span>→</span>
            </Link>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
            {editorsPick && (
              <div className="col-span-2 row-span-2 hidden lg:block">
                <div className="group relative h-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image src={editorsPick.image} alt={editorsPick.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-300 uppercase backdrop-blur-sm border border-white/10">Editor&apos;s Pick</span>
                    <h3 className="mt-2 font-heading text-xl font-bold text-white">{editorsPick.name}</h3>
                    <p className="mt-1 text-sm text-stone-400 line-clamp-2">{editorsPick.desc}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xl font-bold text-red-400">{formatPrice(editorsPick.price)}</span>
                    </div>
                    <Link href={`/products/${editorsPick.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-red-700 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-primary/25">
                      {t("viewDetails")}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {featuredCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGES.barn} alt="Tobacco barn" fill className="object-cover" loading="lazy" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/80 to-stone-900/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary/70 uppercase">About Us</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">{t("aboutTitle")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-400 leading-relaxed text-sm">{t("aboutDescription")}</p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { num: "500+", label: t("statBrands") },
              { num: "100%", label: t("statAuthentic") },
              { num: "🇯🇵", label: t("statMadeInJapan") },
            ].map((s) => (
              <div key={s.label} className="group rounded-2xl p-4 text-center backdrop-blur-sm bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <p className="font-heading text-2xl font-bold text-red-400 transition-transform group-hover:scale-110 sm:text-3xl">{s.num}</p>
                <p className="mt-1 text-sm font-medium text-white">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-primary via-red-700 to-red-900">
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-white/5 blur-[80px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-[80px]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-red-200/80 uppercase">Newsletter</span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">{t("newsletterTitle")}</h2>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

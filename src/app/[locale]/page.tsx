import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1502389872488-08725e638945?w=1920&q=80",
  barn: "https://images.unsplash.com/photo-1634922951968-11ca107aa6e3?w=1920&q=80",
};

export default async function HomePage() {
  const t = await getTranslations("home");

  const [categories, featuredProducts, allProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getProducts(),
  ]);

  const category = categories[0] ?? null;
  const editorsPick = featuredProducts[0] ?? allProducts[0] ?? null;
  const featuredCards = featuredProducts
    .filter((p) => p.id !== editorsPick?.id)
    .slice(0, 5);
  const newArrivals = allProducts.slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO — Split-screen ===== */}
      <section className="relative min-h-[85vh] grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src={HERO_IMAGES.main}
            alt="Premium Japanese cigarettes"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-950/60" />
          <div className="absolute bottom-12 left-12 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl shadow-2xl">
            <p className="text-4xl font-heading font-bold text-red-400">500+</p>
            <p className="mt-1 text-sm text-stone-300">日本製銘柄</p>
          </div>
        </div>

        <div className="relative flex items-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 px-8 py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute inset-0 lg:hidden">
            <img src={HERO_IMAGES.main} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/80" />
          </div>

          <div className="relative max-w-lg">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-primary to-primary/40" />
              <span className="text-xs font-bold tracking-[0.3em] text-primary/70 uppercase">Est. 2001</span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-[1.15] text-white sm:text-5xl">
              日本製たばこの
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                最高品質を。
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-400">
              日本国内の厳選したプレミアムたばこを通販でお届けします。全500銘柄以上の日本製たばこから、あなたの好みの一本を見つけてください。
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-red-700 pl-6 pr-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]"
              >
                商品一覧へ
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all group-hover:bg-white/30">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
              <Link
                href="/guide"
                className="inline-flex h-12 items-center rounded-full border border-stone-700 bg-white/5 px-6 text-sm font-medium text-stone-300 backdrop-blur-sm transition-all hover:border-stone-500 hover:bg-white/10 hover:text-white"
              >
                初心者ガイド
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
              ◆ 日本製たばこ専門店 ◆ 500銘柄以上 ◆ 最高品質 ◆ 正規品保証 ◆ 迅速配送
            </span>
          ))}
        </div>
      </div>

      {/* ===== CATEGORY + FEATURED (merged) ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-stone-50/80 to-white">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/3 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {/* Category showcase — compact horizontal */}
          <div className="mb-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Categories</span>
                </div>
                <h2 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">カテゴリー</h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                すべて見る <span>→</span>
              </Link>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:h-[280px]">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative md:col-span-2 overflow-hidden rounded-2xl shadow-lg"
                >
                  <img src={category.image} alt={category.nameJa} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-300 uppercase backdrop-blur-sm border border-white/10">{category.count}+</span>
                    <h3 className="mt-2 font-heading text-xl font-bold text-white">{category.nameJa}</h3>
                    <p className="mt-1 text-sm text-stone-300">{category.description}</p>
                  </div>
                </Link>
              )}
              <div className="flex flex-col gap-4">
                <div className="relative flex-1 overflow-hidden rounded-2xl p-5 flex flex-col justify-center bg-gradient-to-br from-stone-900 to-stone-800">
                  <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-primary/10 blur-[60px]" />
                  <div className="relative">
                    <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent mb-3" />
                    <p className="text-sm leading-relaxed text-stone-400">
                      日本たばこ（JT）をはじめ、国内全メーカーの紙巻たばこを取り扱う専門店です。
                    </p>
                  </div>
                </div>
                <Link
                  href="/products"
                  className="group flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-red-700 p-5 flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01]"
                >
                  <span className="font-heading text-base font-bold transition-transform group-hover:translate-x-1">全商品を見る →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Featured</span>
                </div>
                <h2 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">おすすめ商品</h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                すべて見る <span>→</span>
              </Link>
            </div>
            <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
              {editorsPick && (
                <div className="col-span-2 row-span-2 hidden lg:block">
                  <div className="group relative h-full overflow-hidden rounded-2xl shadow-2xl">
                    <img src={editorsPick.image} alt={editorsPick.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-300 uppercase backdrop-blur-sm border border-white/10">Editor&apos;s Pick</span>
                      <h3 className="mt-2 font-heading text-xl font-bold text-white">{editorsPick.name}</h3>
                      <p className="mt-1 text-sm text-stone-400 line-clamp-2">{editorsPick.desc}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-xl font-bold text-red-400">{formatPrice(editorsPick.price)}</span>
                      </div>
                      <Link
                        href={`/products/${editorsPick.slug}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-red-700 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-primary/25"
                      >
                        詳細を見る
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
        </div>
      </section>

      {/* ===== ABOUT STRIP (compact) ===== */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0">
          <img src={HERO_IMAGES.barn} alt="Tobacco barn" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/80 to-stone-900/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary/70 uppercase">About Us</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">当店について</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-400 leading-relaxed text-sm">
              日本製たばこの最高品質を追求し、500銘柄以上のプレミアムたばこを厳選してお届けしております。
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { num: "500+", label: "銘柄数" },
              { num: "1", label: "国" },
              { num: "100%", label: "正規品" },
            ].map((s) => (
              <div key={s.label} className="group rounded-2xl p-4 text-center backdrop-blur-sm bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <p className="font-heading text-2xl font-bold text-red-400 transition-transform group-hover:scale-110 sm:text-3xl">{s.num}</p>
                <p className="mt-1 text-sm font-medium text-white">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER (compact) ===== */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-primary via-red-700 to-red-900">
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-white/5 blur-[80px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-[80px]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-red-200/80 uppercase">Newsletter</span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">新着情報を受け取る</h2>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

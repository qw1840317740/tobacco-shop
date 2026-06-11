import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo-json-ld";
import { getAllPosts, getLocalizedPost } from "@/lib/blog-data";
import Image from "next/image";
import type { Metadata } from "next";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "ブログ",
      description:
        "日本たばこの魅力を深掘りする記事。ブランド史、文化、初心者ガイドなど、たばこにまつわる物語をお届けします。",
    },
    en: {
      title: "Blog",
      description:
        "Deep dives into the world of Japanese tobacco. Brand histories, culture, and guides — stories from the heart of Japan's tobacco heritage.",
    },
    zh: {
      title: "博客",
      description:
        "深入探索日本香烟的世界。品牌历史、文化故事和指南——来自日本烟草文化的精彩内容。",
    },
  };
  const d = data[locale] ?? data.ja;
  return { title: d.title, description: d.description };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BreadcrumbJsonLd
        items={[{ name: tNav("blog"), url: `${SITE_URL}/${locale}/blog` }]}
      />
      <Breadcrumb items={[{ label: tNav("blog") }]} />

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
            Blog
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-stone-500">{t("subtitle")}</p>
      </div>

      {/* Article grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => {
            const localized = getLocalizedPost(post, locale);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-stone-200/50 bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={localized.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Category badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-primary uppercase backdrop-blur-sm">
                    {t("brandHistory")}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h2 className="font-heading text-lg font-bold text-stone-800 transition-colors group-hover:text-primary line-clamp-2">
                    {localized.title}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500 line-clamp-3">
                    {localized.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      {post.publishedAt}
                    </span>
                    <span className="text-xs font-medium text-primary opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      {t("readMore")} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <span className="text-2xl">📝</span>
          </div>
          <p className="mt-4 text-stone-400">{t("noArticles")}</p>
        </div>
      )}
    </div>
  );
}

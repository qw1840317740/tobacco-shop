import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo-json-ld";
import { getAllPosts, getLocalizedPost } from "@/lib/blog-data";
import { routing } from "@/lib/routing";
import Image from "next/image";
import type { Metadata } from "next";
import { PenLine } from "lucide-react";

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

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/blog`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/blog`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages,
    },
  };
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
    <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-6">
      <BreadcrumbJsonLd
        items={[{ name: tNav("blog"), url: `${SITE_URL}/${locale}/blog` }]}
      />
      <Breadcrumb items={[{ label: tNav("blog") }]} />

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#C8A97E]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#C8A97E] uppercase">
            Blog
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[#888888]">{t("subtitle")}</p>
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
                className="group overflow-hidden rounded-lg border border-[#E5E5E5]/50 bg-white shadow-sm transition-all duration-300 hover:border-[#C8A97E]/20 hover:shadow-sm hover:-translate-y-1"
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
                  <div className="absolute inset-0" />
                  {/* Category badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#C8A97E] uppercase">
                    {t("brandHistory")}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h2 className="text-lg font-bold text-[#1A1A1A] transition-colors group-hover:text-[#C8A97E] line-clamp-2">
                    {localized.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#888888] line-clamp-3">
                    {localized.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[#888888]">
                      {post.publishedAt}
                    </span>
                    <span className="text-xs font-medium text-[#C8A97E] opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
            <PenLine className="h-8 w-8 text-[#C8A97E]" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[#888888]">{t("noArticles")}</p>
        </div>
      )}
    </div>
  );
}

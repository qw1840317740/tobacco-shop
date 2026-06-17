import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo-json-ld";
import { getPostBySlug, getLocalizedPost } from "@/lib/blog-data";
import { routing } from "@/lib/routing";
import Image from "next/image";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const localized = getLocalizedPost(post, locale);

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/blog/${slug}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/blog/${slug}`;

  return {
    title: localized.title,
    description: localized.excerpt,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: localized.title,
      description: localized.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage, width: 1200, height: 675, alt: localized.title }],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const localized = getLocalizedPost(post, locale);
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");

  return (
    <>
      <ArticleJsonLd
        headline={localized.title}
        description={localized.excerpt}
        image={post.coverImage}
        datePublished={post.publishedAt}
        authorName={post.author}
        url={`${SITE_URL}/${locale}/blog/${post.slug}`}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <BreadcrumbJsonLd
          items={[
            { name: tNav("blog"), url: `${SITE_URL}/${locale}/blog` },
            { name: localized.title, url: `${SITE_URL}/${locale}/blog/${post.slug}` },
          ]}
        />
        <Breadcrumb
          items={[
            { label: tNav("blog"), href: "/blog" },
            { label: localized.title },
          ]}
        />

        {/* Hero image */}
        <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-lg shadow-sm">
          <Image
            src={post.coverImage}
            alt={localized.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div className="absolute inset-0" />
        </div>

        {/* Article header */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-[10px] font-bold tracking-wider text-[#C8A97E] uppercase">
              {t("brandHistory")}
            </span>
            <span className="text-xs text-[#888888]">{post.publishedAt}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-[#1A1A1A] sm:text-4xl">
            {localized.title}
          </h1>
          <p className="mt-3 text-sm text-[#888888]">by {post.author}</p>
        </div>

        {/* Article body */}
        <article
          className="prose-custom mt-10 text-[#888888]"
          dangerouslySetInnerHTML={{ __html: localized.content }}
        />

        {/* Health warning */}
        <div className="mt-12 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 leading-relaxed">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-800" strokeWidth={1.5} /> 喫煙は肺癌、脳卒中等の疾病のリスクを高めます。未満20歳の喫煙は法律で禁止されています。 / Smoking increases the risk of lung cancer, stroke, and other diseases.
        </div>

        {/* Back to blog */}
        <div className="mt-8 border-t pt-6">
          <Link
            href="/blog"
            className="text-sm text-[#C8A97E] hover:underline"
          >
            {t("backToBlog")}
          </Link>
        </div>
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo-json-ld";
import { getPostBySlug, getLocalizedPost } from "@/lib/blog-data";
import Image from "next/image";
import type { Metadata } from "next";

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

  return {
    title: localized.title,
    description: localized.excerpt,
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
        <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={post.coverImage}
            alt={localized.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Article header */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
              {t("brandHistory")}
            </span>
            <span className="text-xs text-stone-400">{post.publishedAt}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-stone-800 sm:text-4xl">
            {localized.title}
          </h1>
          <p className="mt-3 text-sm text-stone-500">by {post.author}</p>
        </div>

        {/* Article body */}
        <article
          className="prose-custom mt-10 text-stone-600"
          dangerouslySetInnerHTML={{ __html: localized.content }}
        />

        {/* Health warning */}
        <div className="mt-12 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 leading-relaxed">
          ⚠️ 喫煙は肺癌、脳卒中等の疾病のリスクを高めます。未満20歳の喫煙は法律で禁止されています。 / Smoking increases the risk of lung cancer, stroke, and other diseases.
        </div>

        {/* Back to blog */}
        <div className="mt-8 border-t pt-6">
          <Link
            href="/blog"
            className="text-sm text-primary hover:underline"
          >
            {t("backToBlog")}
          </Link>
        </div>
      </div>
    </>
  );
}

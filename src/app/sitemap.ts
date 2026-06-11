import { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data-store";
import { getAllPosts } from "@/lib/blog-data";

const SITE_URL = "https://tabacoya.jp";
const LOCALES = ["ja", "en", "zh"];

function localeEntry(path: string, locale: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const blogPosts = getAllPosts();

  // Static pages (no locale prefix needed — one entry per locale)
  const staticPaths = ["", "/products", "/categories", "/about", "/guide", "/contact", "/blog"];
  const staticEntries: MetadataRoute.Sitemap = [];
  for (const path of staticPaths) {
    for (const locale of LOCALES) {
      staticEntries.push({
        ...localeEntry(path, locale),
        priority: path === "" ? 1.0 : 0.8,
        changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      });
    }
  }

  // Legal pages
  const legalPaths = ["/legal/privacy", "/legal/terms", "/legal/shipping", "/legal/returns", "/legal/age-verification"];
  for (const path of legalPaths) {
    for (const locale of LOCALES) {
      staticEntries.push({
        ...localeEntry(path, locale),
        priority: 0.4,
        changeFrequency: "monthly" as const,
      });
    }
  }

  // Category pages
  const categoryEntries: MetadataRoute.Sitemap = [];
  for (const cat of categories) {
    for (const locale of LOCALES) {
      categoryEntries.push({
        url: `${SITE_URL}/${locale}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  // Product pages
  const productEntries: MetadataRoute.Sitemap = [];
  for (const prod of products) {
    for (const locale of LOCALES) {
      productEntries.push({
        url: `${SITE_URL}/${locale}/products/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  // Blog article pages
  const blogEntries: MetadataRoute.Sitemap = [];
  for (const post of blogPosts) {
    for (const locale of LOCALES) {
      blogEntries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...categoryEntries, ...productEntries, ...blogEntries];
}

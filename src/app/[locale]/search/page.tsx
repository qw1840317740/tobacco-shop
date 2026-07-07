import { routing } from "@/lib/routing";
import SearchClient from "./SearchClient";
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
      title: "商品検索",
      description:
        "TABACOYAの商品検索。日本製たばこのラインナップからお好みのたばこをお探しください。",
    },
    en: {
      title: "Search Products",
      description:
        "Search TABACOYA's collection of 500+ authentic Japanese cigarettes. Find your favorite brands quickly.",
    },
    zh: {
      title: "商品搜索",
      description:
        "TABACOYA商品搜索。从500种以上的日本制造香烟中找到您喜欢的品牌。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/search`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/search`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/search`,
      languages,
    },
  };
}

export default function SearchPage() {
  return <SearchClient />;
}

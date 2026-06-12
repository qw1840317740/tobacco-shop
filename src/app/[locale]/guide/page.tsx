import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/routing";
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
      title: "初心者ガイド",
      description:
        "日本製たばこの初心者向けガイド。たばこの種類、濃さの選び方、味わいガイドなど、イラスト付きでわかりやすく解説します。",
    },
    en: {
      title: "Beginner's Guide",
      description:
        "A beginner's guide to Japanese cigarettes. Learn about cigarette types, strength levels, and flavor profiles with easy-to-follow illustrated guides.",
    },
    zh: {
      title: "新手指南",
      description:
        "日本制造香烟的新手指南。用图文并茂的方式讲解香烟种类、浓度选择和口味指南。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/guide`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/guide`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guide`,
      languages,
    },
  };
}

const GUIDE_IMAGES = [
  "https://images.unsplash.com/photo-1589279003513-467d320f47eb?w=600&q=80",
  "https://images.unsplash.com/photo-1598346764658-b5d9d56e1e28?w=600&q=80",
  "https://images.unsplash.com/photo-1528458876861-544fd1b4e455?w=600&q=80",
  "https://images.unsplash.com/photo-1566312922674-7e4c4b5f2c6a?w=600&q=80",
];

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guidePage");

  // Access the guides array from translations
  const guideCount = 4;
  const guides = Array.from({ length: guideCount }, (_, i) => ({
    title: t(`guides.${i}.title`),
    desc: t(`guides.${i}.desc`),
    img: GUIDE_IMAGES[i],
    icon: ["🚬", "📚", "💪", "🌸"][i],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>
      <p className="mt-2 text-[#888888]">{t("subtitle")}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {guides.map((guide) => (
          <Card key={guide.title} className="group overflow-hidden transition-all hover:shadow-sm">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image src={guide.img} alt={guide.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" sizes="(max-width: 640px) 100vw, 50vw" />
            </div>
            <div className="p-6">
              <div className="text-2xl mb-2">{guide.icon}</div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#C8A97E]">{guide.title}</h2>
              <p className="mt-2 text-sm text-[#888888]">{guide.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

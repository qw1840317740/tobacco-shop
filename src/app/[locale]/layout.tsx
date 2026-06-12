import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/lib/routing";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import MobileNav from "@/components/layout/MobileNav";
import { OrganizationJsonLd } from "@/components/seo-json-ld";
import type { Metadata } from "next";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    ja: "日本製たばこ専門オンラインショップ",
    en: "Premium Japanese Cigarettes Online Shop",
    zh: "日本制造香烟专营网店",
  };
  const descriptions: Record<string, string> = {
    ja: "日本製たばこの専門オンラインショップ。JTをはじめ国内全メーカーの厳選した500銘柄以上のプレミアムたばこを全国にお届けします。",
    en: "Specialty online shop for premium Japanese cigarettes. Curated selection of 500+ authentic brands from JT and domestic manufacturers.",
    zh: "日本制造香烟的专营网店。精选JT等国内全品牌500种以上的优质香烟，配送到全国各地。",
  };

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}`;

  return {
    title: titles[locale] ?? titles.ja,
    description: descriptions[locale] ?? descriptions.ja,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      locale: locale === "ja" ? "ja_JP" : locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => (l === "ja" ? "ja_JP" : l === "zh" ? "zh_CN" : "en_US")),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <OrganizationJsonLd />
        <Header />
        <main className="flex-1 bg-gradient-to-b from-stone-50/50 to-white">
          <div className="relative">
            {children}
          </div>
        </main>
        <Footer />
        <CartDrawer />
        <MobileNav />
        <Toaster />
      </div>
    </NextIntlClientProvider>
  );
}

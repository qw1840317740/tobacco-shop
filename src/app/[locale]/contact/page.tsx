import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/routing";
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
      title: "お問い合わせ",
      description:
        "TABACOYAへのお問い合わせはこちら。商品・ご注文・配送・返品に関するご質問にお答えします。平日9:00〜18:00対応。",
    },
    en: {
      title: "Contact Us",
      description:
        "Contact TABACOYA for questions about products, orders, shipping, and returns. We respond on weekdays 9:00–18:00 JST.",
    },
    zh: {
      title: "联系我们",
      description:
        "TABACOYA联系方式。商品、订单、配送、退货相关问题请在此咨询。工作日9:00〜18:00。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/contact`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/contact`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: t("title") }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>
      <p className="mt-2 text-[#888888]">{t("subtitle")}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Contact Form */}
        <Card className="lg:col-span-3 p-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("nameLabel")}</Label>
                <Input placeholder={t("namePlaceholder")} className="mt-1" />
              </div>
              <div>
                <Label>{t("emailLabel")}</Label>
                <Input type="email" placeholder="email@example.com" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{t("typeLabel")}</Label>
              <select className="mt-1 w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm">
                <option>{t("typeProduct")}</option>
                <option>{t("typeOrder")}</option>
                <option>{t("typeShipping")}</option>
                <option>{t("typeReturn")}</option>
                <option>{t("typeAge")}</option>
                <option>{t("typeOther")}</option>
              </select>
            </div>
            <div>
              <Label>{t("orderNumberLabel")}</Label>
              <Input placeholder="ORD-2026-XXX" className="mt-1" />
            </div>
            <div>
              <Label>{t("messageLabel")}</Label>
              <textarea
                rows={6}
                placeholder={t("messagePlaceholder")}
                className="mt-1 w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E]"
              />
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              {t("notice")}
            </div>
            <Button className="w-full bg-[#1A1A1A] text-white hover:bg-[#333] opacity-50 cursor-not-allowed" disabled>
              {t("submitButton")}
            </Button>
          </div>
        </Card>

        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A97E]">{t("phoneTitle")}</h3>
            <p className="mt-3 text-2xl font-bold text-[#1A1A1A]">0120-XXX-XXX</p>
            <p className="mt-1 text-xs text-[#888888]">{t("phoneHours")}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A97E]">{t("emailTitle")}</h3>
            <p className="mt-3 text-sm font-medium text-[#1A1A1A]">support@tabacoya.jp</p>
            <p className="mt-1 text-xs text-[#888888]">{t("emailHours")}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A97E]">{t("faqTitle")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-[#888888]">
                <span className="font-medium">{t("faq1Q")}</span><br />
                <span className="text-[#888888]">{t("faq1A")}</span>
              </li>
              <li className="text-[#888888]">
                <span className="font-medium">{t("faq2Q")}</span><br />
                <span className="text-[#888888]">{t("faq2A")}</span>
              </li>
              <li className="text-[#888888]">
                <span className="font-medium">{t("faq3Q")}</span><br />
                <span className="text-[#888888]">{t("faq3A")}</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">{t("backToHome")}</Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Playfair_Display, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Title template: child pages set their own title, which gets "| TABACOYA" appended
export const metadata: Metadata = {
  title: {
    template: "%s | TABACOYA",
    default: "TABACOYA（タバコ屋） - Premium Japanese Cigarettes",
  },
  description:
    "日本製たばこの専門オンラインショップ。JTをはじめ国内全メーカーの厳選した500銘柄以上のプレミアムたばこを全国にお届けします。",
  metadataBase: new URL("https://tabacoya.jp"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US", "zh_CN"],
    siteName: "TABACOYA",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className={`${playfair.variable} ${notoSerifJP.variable} flex min-h-full flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

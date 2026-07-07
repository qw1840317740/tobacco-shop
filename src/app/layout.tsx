import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Title template: child pages set their own title, which gets "| TABACOYA" appended
export const metadata: Metadata = {
  title: {
    template: "%s | TABACOYA",
    default: "TABACOYA（タバコ屋） - Premium Japanese Cigarettes",
  },
  description:
    "日本製たばこの専門オンラインショップ。JTをはじめ国内メーカーの厳選した本物のたばこを全国にお届けします。",
  metadataBase: new URL("https://tabacoya.jp"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US", "zh_CN"],
    siteName: "TABACOYA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1601015191768-5a2c7c6c4c38?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "TABACOYA - Premium Japanese Cigarettes",
      },
    ],
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
      <body className={`${inter.variable} flex min-h-full flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

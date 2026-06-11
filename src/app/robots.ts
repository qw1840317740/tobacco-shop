import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/age-verify", "/checkout", "/profile", "/orders", "/wishlist"],
      },
    ],
    sitemap: "https://tabacoya.jp/sitemap.xml",
  };
}

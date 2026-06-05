import { getAllCategories } from "@/lib/data-store";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tBrands = await getTranslations("brands");

  const categories = await getAllCategories();

  // Group by group field
  const groups: Record<string, typeof categories> = {};
  const groupOrder = ["jt_japan", "jt_international", "ploom"];
  for (const cat of categories) {
    const g = cat.group || "other";
    if (!groups[g]) groups[g] = [];
    groups[g].push(cat);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: tBrands("title") }]} />

      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{tBrands("title")}</h1>
        <p className="mt-2 text-stone-500">{tBrands("subtitle")}</p>
      </div>

      {groupOrder.map((groupKey) => {
        const items = groups[groupKey];
        if (!items || items.length === 0) return null;

        return (
          <div key={groupKey} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              <h2 className="text-lg font-bold text-stone-700">{tBrands(groupKey as any)}</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((cat) => {
                const localizedName = locale === "en" && cat.nameEn ? cat.nameEn
                  : locale === "zh" && cat.nameZh ? cat.nameZh
                  : cat.nameJa;
                const productCount = cat.count || 0;

                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-stone-200/60 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-colors group-hover:from-primary/20 group-hover:to-primary/10">
                        <span className="text-lg font-bold">{localizedName.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-stone-700 transition-colors group-hover:text-primary">
                          {localizedName}
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-400">
                          {tBrands("productCount", { count: productCount })}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

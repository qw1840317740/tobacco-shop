import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const t = useTranslations("nav");

  return (
    <nav
      // Sticky just below the global header. z-30 keeps it above product
      // cards/images; backdrop-blur + translucent bg lets the user see
      // content scrolling behind it without obscuring it.
      className="sticky top-16 z-30 mb-6 flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white/95 px-4 py-2.5 text-sm shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <Link href="/" className="flex items-center gap-1 text-[#888] transition-colors hover:text-[#C8A97E]">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("home")}</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-[#CCCCCC]" />
          {item.href ? (
            <Link href={item.href} className="text-[#888] transition-colors hover:text-[#C8A97E]">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[#1A1A1A]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

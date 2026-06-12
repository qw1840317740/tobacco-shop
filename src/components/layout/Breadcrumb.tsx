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
    <nav className="mb-6 flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm">
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

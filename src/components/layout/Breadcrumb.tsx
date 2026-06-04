import { Link } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-stone-50 to-stone-100/50 px-4 py-2.5 text-sm border border-stone-200/50 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-1 text-stone-400 transition-colors hover:text-primary">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">ホーム</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
          {item.href ? (
            <Link href={item.href} className="text-stone-500 transition-colors hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-stone-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

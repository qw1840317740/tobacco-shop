import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 日元价格格式化（无小数，千分位逗号） */
export function formatPrice(price: number): string {
  return `¥${Math.round(price).toLocaleString()}`;
}

/** 根据语言获取本地化商品名称 */
export function getLocalizedName(
  product: { name: string; nameEn?: string; nameZh?: string },
  locale: string
): string {
  if (locale === "en" && product.nameEn) return product.nameEn;
  if (locale === "zh" && product.nameZh) return product.nameZh;
  return product.name;
}

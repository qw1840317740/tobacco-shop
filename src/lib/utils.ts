import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 日元价格格式化（无小数，千分位逗号） */
export function formatPrice(price: number): string {
  return `¥${Math.round(price).toLocaleString()}`;
}

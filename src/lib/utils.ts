import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, isAr?: boolean) {
  if (isAr) {
    return new Intl.NumberFormat('ar-EG').format(num);
  }
  return num.toString();
}

import { createClient } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  let formattedValue: string;

  if (value >= 1_000_000) {
    // Divide by 1,000,000 and append "M"
    const millionValue = value / 1_000_000;
    formattedValue =
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: millionValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(millionValue) + "M";
  } else {
    // Format normally for values less than 1,000,000
    formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return formattedValue;
}

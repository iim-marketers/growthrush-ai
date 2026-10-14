import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`
}

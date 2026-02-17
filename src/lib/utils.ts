import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const DEFAULT_LOCALE = "en-US"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ALLOWED_IMPORT_MIME = new Set(["application/pdf", "text/csv"])

export function hasAllowedExtension(filename: string) {
  const lower = filename.toLowerCase()
  return lower.endsWith(".csv") || lower.endsWith(".pdf")
}

export function formatCurrency(
  amount: number,
  locale: Intl.LocalesArgument = DEFAULT_LOCALE,
) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return formatted
}

export function formatDate(
  input: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale: Intl.LocalesArgument = DEFAULT_LOCALE,
) {
  if (!input) return ""

  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ""

  if (options) {
    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

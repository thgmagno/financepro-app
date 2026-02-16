import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ALLOWED_IMPORT_MIME = new Set(["application/pdf", "text/csv"])

export function hasAllowedExtension(filename: string) {
  const lower = filename.toLowerCase()
  return lower.endsWith(".csv") || lower.endsWith(".pdf")
}

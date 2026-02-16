import type { Transaction } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transactionStatusMap(transaction: Transaction) {
  switch (transaction.type) {
    case "INCOME":
      return transaction.occurredAt ? "Receipt" : "Pending"

    case "OUTCOME":
      return transaction.occurredAt ? "Paid" : "Pending"

    default:
      return "Pending"
  }
}

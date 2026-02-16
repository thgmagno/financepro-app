"use client"

import { transactionStatusMap } from "@/lib/utils"
import type { Transaction } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "effectiveAt",
    header: "Date",
  },
  {
    accessorKey: "occurredAt",
    header: "Status",
    cell: ({ row }) => transactionStatusMap(row.original),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
]

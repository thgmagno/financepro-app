"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
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
    cell: ({ row }) => {
      return <div>{formatDate(new Date(row.getValue("effectiveAt")))}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("amount"))}
        </div>
      )
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
]

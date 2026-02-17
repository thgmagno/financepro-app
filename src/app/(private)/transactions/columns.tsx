"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { getStatusLabel } from "@/lib/transaction.utils"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {String(row.getValue("description")).toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: "effectiveAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(new Date(row.getValue("effectiveAt")), {
            year: "2-digit",
            month: "short",
            day: "2-digit",
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <div>{getStatusLabel(row.getValue("type"))}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div>{getStatusLabel(row.getValue("status"))}</div>
    },
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
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {String(row.getValue("note")).toLowerCase()}
        </div>
      )
    },
  },
]

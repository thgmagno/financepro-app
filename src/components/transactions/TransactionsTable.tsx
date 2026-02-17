"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/types"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { TransactionsEditBatchDialog } from "./TransactionsEditBatchDialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function TransactionsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const selectedTransactions = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as Transaction)

  const numberSelectedRows = selectedTransactions.length

  const totalSelectedIncome = selectedTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, tt) => acc + tt.amount, 0)

  const totalSelectedOutcome = selectedTransactions
    .filter((t) => t.type === "OUTCOME")
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-muted-foreground flex-1 text-sm">
        {numberSelectedRows} of {table.getFilteredRowModel().rows.length} row(s)
        selected.
      </div>

      {numberSelectedRows > 0 && (
        <div className="flex sticky bottom-0 left-0 p-3 w-full bg-background border-t-2 gap-1 flex-wrap">
          <TransactionsEditBatchDialog transactions={selectedTransactions} />
          <Badge className="cursor-default select-none">
            <ArrowDown /> {formatCurrency(totalSelectedIncome)} | <ArrowUp />
            {formatCurrency(totalSelectedOutcome)}
          </Badge>
        </div>
      )}
    </div>
  )
}

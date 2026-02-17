"use client"

import type { Transaction } from "@/types"
import { Edit } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

interface TransactionsEditBatchDialogProps {
  transactions: Transaction[]
}

export function TransactionsEditBatchDialog({
  transactions,
}: TransactionsEditBatchDialogProps) {
  const transactionIds = Array.from(transactions.map((t) => t.id))

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="xs">
          <Edit /> Edit batch
        </Button>
      </DialogTrigger>

      <form action="">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit batch</DialogTitle>
            <DialogDescription className="text-important font-medium">
              The changes will be applied to all selected transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
            <input type="hidden" name="transactionIds" value={transactionIds} />

            {transactions.map((t) => (
              <span key={t.id}>{t.id}</span>
            ))}
          </div>

          <DialogFooter className="flex items-center justify-between">
            <span className="text-sm">Selected: {transactions.length}</span>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

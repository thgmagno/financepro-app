import type { Transaction } from "@/types"
import { Edit } from "lucide-react"
import { UpdateBatchTransactionForm } from "../forms/transaction/UpdateBatchTransactionForm"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

export function TransactionsEditBatchDialog({
  transactions,
}: {
  transactions: Transaction[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xs">
          <Edit /> Edit batch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit batch</DialogTitle>
          <DialogDescription className="text-important font-medium">
            The changes will be applied to all selected transactions.
          </DialogDescription>
        </DialogHeader>
        <UpdateBatchTransactionForm
          transactions={transactions}
          className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto"
        />
      </DialogContent>
    </Dialog>
  )
}

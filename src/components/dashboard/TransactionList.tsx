import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/types"
import { Landmark } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime(),
  )

  for (const t of sorted) {
    const dateKey = t.effectiveAt.toString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(t)
  }

  return Object.entries(groups)
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "INCOME"

  return (
    <div className="flex items-center gap-3 pb-5 border-b last:border-0">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
          isIncome ? "bg-success/10" : "bg-muted"
        }`}
      >
        <Landmark
          className={`size-4 ${
            isIncome ? "text-success" : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">
          {transaction.description}
        </span>
        <span className="text-xs text-muted-foreground">
          {transaction.note}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isIncome ? "text-success" : "text-foreground"
          }`}
        >
          {isIncome ? "+ " : "- "}
          {formatCurrency(transaction.amount)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(transaction.occurredAt, {
            month: "short",
            day: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}

export function TransactionList({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const groups = groupByDate(transactions)

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([date, items]) => {
        const dayTotal = items.reduce((sum, t) => {
          return t.type === "INCOME" ? sum + t.amount : sum - t.amount
        }, 0)

        return (
          <Card key={date} className="shadow-none border-none pb-6">
            <CardHeader className="cursor-default select-none">
              <CardTitle>
                {formatDate(items[0].effectiveAt, { dateStyle: "long" })}
              </CardTitle>
              <CardAction
                className={`text-xs font-semibold tabular-nums ${
                  dayTotal >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {dayTotal >= 0 ? "+" : ""}
                {formatCurrency(dayTotal)}
              </CardAction>
            </CardHeader>
            <CardContent>
              {items.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

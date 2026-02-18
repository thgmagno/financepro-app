import { formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/types"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"

export function SummaryCards({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutcome = transactions
    .filter((t) => t.type === "OUTCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalOutcome

  const cards = [
    {
      label: "Income",
      value: totalIncome,
      icon: ArrowDown,
      bgCard: "bg-card",
      bgIcon: "bg-success/15",
      color: "text-success",
    },
    {
      label: "Outcome",
      value: totalOutcome,
      icon: ArrowUp,
      bgCard: "bg-card",
      bgIcon: "bg-destructive/15",
      color: "text-destructive",
    },
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      bgCard: balance >= 0 ? "bg-success/10" : "bg-destructive/10",
      bgIcon: balance >= 0 ? "bg-success/10" : "bg-destructive/10",
      color: balance >= 0 ? "text-success" : "text-destructive",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`flex items-center rounded-xl p-4 gap-4 ${c.bgCard}`}
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${c.bgIcon}`}
          >
            <c.icon size={20} className={c.color} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {c.label}
            </span>
            <span className="text-xl font-semibold leading-none text-muted-foreground">
              {formatCurrency(c.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

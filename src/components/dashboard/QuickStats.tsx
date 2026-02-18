import type { Transaction } from "@/types"
import { ArrowDown, ArrowUp, CalendarDays, Hash } from "lucide-react"

export function QuickStats({ transactions }: { transactions: Transaction[] }) {
  const totalTransactions = transactions.length
  const incomeCount = transactions.filter((t) => t.type === "INCOME").length
  const outcomeCount = transactions.filter((t) => t.type === "OUTCOME").length

  const daysWithTransactions = new Set(
    transactions.map((t) => t.effectiveAt.toString()),
  ).size

  const stats = [
    {
      label: "Total",
      value: totalTransactions,
      icon: Hash,
    },
    {
      label: "Income",
      value: incomeCount,
      icon: ArrowDown,
    },
    {
      label: "Outcome",
      value: outcomeCount,
      icon: ArrowUp,
    },
    {
      label: "Days",
      value: daysWithTransactions,
      icon: CalendarDays,
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse items-center gap-2 rounded-xl bg-card p-4 md:flex-row md:justify-center md:p-8"
        >
          <span className="text-xl font-bold text-foreground tabular-nums leading-none">
            {stat.value}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </span>
          <stat.icon className="text-muted-foreground md:ml-auto" />
        </div>
      ))}
    </div>
  )
}

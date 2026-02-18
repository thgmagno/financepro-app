import { getTransactions } from "@/actions/transaction"
import { Page } from "@/components/layout/Page"
import { TransactionsFilters } from "@/components/transactions/TransactionsFilters"
import { TransactionsImportBtn } from "@/components/transactions/TransactionsImportBtn"
import { TransactionsTable } from "@/components/transactions/TransactionsTable"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { columns } from "./columns"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function buildTransactionsUrl(
  basePath: string,
  sp: { [key: string]: string | string[] | undefined },
) {
  const allowed = ["scope", "type", "from", "to", "q"] as const
  const params = new URLSearchParams()

  for (const key of allowed) {
    const value = sp[key]
    if (!value) continue

    const v = Array.isArray(value) ? value[0] : value

    const trimmed = String(v).trim()
    if (!trimmed) continue

    params.set(key, trimmed)
  }

  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export default async function Transactions(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const url = buildTransactionsUrl("/transactions", searchParams)
  const transactions = await getTransactions(url)

  return (
    <Page>
      <header className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <TransactionsImportBtn />
        <Link
          href="/transactions/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus />
          Create new
        </Link>
      </header>
      <TransactionsFilters />
      <TransactionsTable columns={columns} data={transactions} />
    </Page>
  )
}

import { getDashboard } from "@/actions/dashboard"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { QuickStats } from "@/components/dashboard/QuickStats"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { TransactionList } from "@/components/dashboard/TransactionList"
import { Page } from "@/components/layout/Page"

export default async function Home() {
  const { data } = await getDashboard()

  return (
    <Page>
      <DashboardHeader
        name={data.name}
        email={data.email}
        groupName={data.group?.name}
      />
      <SummaryCards transactions={data.transactions} />
      <QuickStats transactions={data.transactions} />
      <TransactionList transactions={data.transactions} />
    </Page>
  )
}

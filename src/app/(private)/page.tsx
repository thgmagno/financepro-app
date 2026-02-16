import { getDashboard } from "@/actions/dashboard"
import { Page } from "@/components/layout/Page"

export default async function Home() {
  const { data } = await getDashboard()

  return (
    <Page>
      <h1>Home</h1>
    </Page>
  )
}

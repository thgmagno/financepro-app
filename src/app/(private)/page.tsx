import { getToken } from "@/actions/session"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"

async function getDashboard() {
  const token = await getToken()
  const res = await fetch(config.routes.dashboard, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  return res.json()
}

export default async function Home() {
  const { data } = await getDashboard()

  return (
    <Page>
      <h1>Home</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Page>
  )
}

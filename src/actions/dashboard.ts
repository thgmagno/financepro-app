import "server-only"

import { getToken, getUserIdFromJwt } from "@/actions/session"
import { config } from "@/config"
import type { Dashboard } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchDashboard(token: string) {
  const res = await fetch(config.routes.dashboard, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`)
  return res.json() as Promise<{ data: Dashboard }>
}

export async function getDashboard() {
  const token = await getToken()
  if (!token) throw new Error("No token")

  const userId = await getUserIdFromJwt(token)

  const getDashboardCached = unstable_cache(
    async (t: string) => fetchDashboard(t),
    ["dashboard", userId],
    {
      revalidate: 10,
      tags: [`dashboard:${userId}`],
    },
  )

  return getDashboardCached(token)
}

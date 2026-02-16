"server-only"

import { config } from "@/config"
import type { Transaction } from "@/types"
import { unstable_cache } from "next/cache"
import { getToken, getUserIdFromJwt } from "./session"

async function fetchTransactions(url: string, token: string) {
  const res = await fetch(config.environment.BASE_API_URL.concat(url), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Transactions fetch failed: ${res.status}`)
  return res.json() as Promise<{ data: Transaction[] }>
}

export async function getTransactions(url: string) {
  const token = await getToken()
  if (!token) throw new Error("No token")

  const userId = await getUserIdFromJwt(token)

  const getTransactionsCached = unstable_cache(
    async (u: string, t: string) => fetchTransactions(u, t),
    ["transactions", userId, url],
    {
      revalidate: 5,
      tags: [`transactions:${userId}:${url}`],
    },
  )

  return getTransactionsCached(url, token)
}

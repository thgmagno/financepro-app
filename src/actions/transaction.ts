/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"server-only"
"use server"

import { config } from "@/config"
import { ALLOWED_IMPORT_MIME, hasAllowedExtension } from "@/lib/utils"
import type { Transaction } from "@/types"
import { revalidatePath, unstable_cache } from "next/cache"
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

export async function uploadTransactionsFile(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const token = await getToken()
    if (!token) return { ok: false, error: "Missing authentication token." }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return { ok: false, error: "Invalid file." }
    }

    if (!hasAllowedExtension(file.name)) {
      return { ok: false, error: "Only .csv or .pdf files are allowed." }
    }

    if (file.type && !ALLOWED_IMPORT_MIME.has(file.type)) {
      return { ok: false, error: "File type not allowed (CSV/PDF only)." }
    }

    const MAX_BYTES = 10 * 1024 * 1024
    if (file.size > MAX_BYTES) {
      return { ok: false, error: "File too large (max 10MB)." }
    }

    const body = new FormData()
    body.append("file", file, file.name)

    const endpoint = "/transactions/import"

    const res = await fetch(config.environment.BASE_API_URL.concat(endpoint), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    })

    if (!res.ok) {
      let msg = `Upload failed: ${res.status}`
      try {
        const json = (await res.json()) as any
        if (json?.message) msg = String(json.message)
      } catch {}
      return { ok: false, error: msg }
    }

    revalidatePath("/")

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error."
    return { ok: false, error: message }
  }
}

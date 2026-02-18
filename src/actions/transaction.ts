"use server"

import { TransactionsEditBatchSchema } from "@/components/forms/transaction/TransactionsEditBatchSchema"
import type { TransactionsEditBatchFormState } from "@/components/forms/transaction/UpdateBatchTransactionForm"
import { config } from "@/config"
import { ALLOWED_IMPORT_MIME, hasAllowedExtension } from "@/lib/utils"
import type { Transaction } from "@/types"
import { revalidatePath, unstable_cache } from "next/cache"
import z from "zod"
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
  const raw = (await res.json()) as { data: Transaction[] }

  return raw.data.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }))
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
        const json = await res.json()
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

export async function batchUpdateTransactionsAction(
  _formState: TransactionsEditBatchFormState,
  formData: FormData,
): Promise<TransactionsEditBatchFormState> {
  const parsed = TransactionsEditBatchSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        scope: tree?.properties?.scope?.errors,
        _form: tree.properties?.transactionIds?.errors[0],
      },
    }
  }

  if (Array.from([parsed.data.scope]).every((i) => i === undefined)) {
    return {
      errors: { _form: "Form data cannot be empty" },
    }
  }

  // try {
  //   const token = await getToken()
  //   const res = await fetch(config.routes.batchUpdateTransactions, {
  //     method: "PATCH",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(parsed.data),
  //   })

  //   const r = await res.json()

  //   if (!res.ok) {
  //     return { errors: { _form: r.message } }
  //   }
  // } catch {
  //   return {
  //     errors: { _form: "Failed to fetch" },
  //   }
  // }

  return { errors: {}, successMessage: "All transactions have been updated." }
}

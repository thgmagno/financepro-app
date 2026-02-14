import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchJson<T = unknown>(
  url: string,
  body?: unknown,
  init?: RequestInit,
) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const ct = res.headers.get("content-type") || ""
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text()

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as any).message)
        : `HTTP ${res.status}`
    throw new Error(message)
  }

  return data as T
}

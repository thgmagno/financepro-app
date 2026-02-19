"use server"

import { config } from "@/config"
import { decodeJwt } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getToken() {
  return (await cookies()).get(config.accessTokenName)?.value
}

export async function endSession() {
  const cookiesStore = await cookies()
  cookiesStore.delete(config.accessTokenName)
  redirect(config.publicRoutes.signIn)
}

export async function getUserIdFromJwt(token?: string) {
  if (!token) return "anonymous"
  const [, payload] = token.split(".")
  if (!payload) return "anonymous"
  const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  return String(json.sub ?? json.userId ?? json.id ?? "unknown")
}

export async function setAccessToken(token: string) {
  let exp: number | undefined
  try {
    const payload = decodeJwt(token)
    exp = typeof payload.exp === "number" ? payload.exp : undefined
  } catch {
    exp = undefined
  }

  if (!exp) {
    exp = 24 * 60 * 60 * 1000 // 1 dia
  }

  const nowSec = Math.floor(Date.now() / 1000)
  const maxAge = exp - nowSec

  const cookieStore = await cookies()
  return cookieStore.set(config.accessTokenName, token, {
    name: config.accessTokenName,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" ? config.domain : undefined,
    maxAge,
  })
}

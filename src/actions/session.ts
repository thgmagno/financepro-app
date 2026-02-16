"use server"

import { config } from "@/config"
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

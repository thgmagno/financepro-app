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

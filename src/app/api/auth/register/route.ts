import { config } from "@/config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const upstream = await fetch(
    new URL("/auth/register", config.environment.BASE_API_URL),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  )

  const data = await upstream.json().catch(() => ({}))

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  const res = NextResponse.json({ ok: true })

  if (data?.data?.accessToken) {
    res.cookies.set("financepro-app-token", `data.accessToken`, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    })
  }

  return res
}

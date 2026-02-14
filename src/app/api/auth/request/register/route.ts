import { config } from "@/config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const upstream = await fetch(
    new URL("/auth/request/register", config.environment.BASE_API_URL),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "x-internal-bff": config.environment.BFF_SHARED_SECRET,
      },
      body: JSON.stringify(body),
    },
  )

  const text = await upstream.text()
  const isJson = upstream.headers
    .get("content-type")
    ?.includes("application/json")
  const data = text && isJson ? JSON.parse(text) : text || null

  if (!upstream.ok) {
    return NextResponse.json(
      typeof data === "object" && data !== null
        ? data
        : { message: String(data ?? "Request failed") },
      { status: upstream.status },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

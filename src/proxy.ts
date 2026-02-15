import * as jose from "jose"
import { type NextRequest, NextResponse } from "next/server"
import { config } from "./config"

function isPublicRoute(pathname: string) {
  return config.publicRoutes.some((route) => {
    if (route === pathname) return true
    if (route !== "/" && pathname.startsWith(route)) return true
    return false
  })
}

function getToken(req: NextRequest) {
  return req.cookies.get(config.accessTokenName)?.value
}

async function isJwtValid(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret)
    await jose.jwtVerify(token, secretKey)
    return true
  } catch {
    return false
  }
}

function isAssetOrPublicFile(pathname: string) {
  if (pathname.startsWith("/_next/")) return true

  if (
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json"
  ) {
    return true
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true

  return false
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isAssetOrPublicFile(pathname)) {
    return NextResponse.next()
  }

  const publicRoute = isPublicRoute(pathname)
  const token = getToken(req)
  const jwtSecret = process.env.JWT_SECRET || "dev-secret"

  // rota pública e NÃO tem token
  if (publicRoute && !token) {
    return NextResponse.next()
  }

  // rota pública e TEM token
  if (publicRoute && token) {
    const valid = await isJwtValid(token, jwtSecret)
    if (!valid) return NextResponse.next()

    const url = req.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // rota NÃO pública e NÃO tem token
  if (!publicRoute && !token) {
    const url = req.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  // rota NÃO pública e TEM token
  if (!publicRoute && token) {
    const valid = await isJwtValid(token, jwtSecret)
    if (valid) return NextResponse.next()

    const url = req.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const configMiddleware = {
  matcher: ["/:path*"],
}

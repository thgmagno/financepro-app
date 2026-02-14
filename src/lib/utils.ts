type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type ClientOptions<TBody = unknown> = {
  method?: HttpMethod
  body?: TBody
  params?: Record<string, string | number | boolean | undefined>
  headers?: HeadersInit
  signal?: AbortSignal
  credentials?: RequestCredentials
}

function buildUrl(path: string, params?: ClientOptions["params"]) {
  const url = new URL(path, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function http<TResp = unknown, TBody = unknown>(
  path: string,
  opts: ClientOptions<TBody> = {},
): Promise<TResp> {
  const url = buildUrl(path, opts.params)

  const hasBody = opts.body !== undefined && opts.method !== "GET"
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...opts.headers,
    },
    body: hasBody ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
    credentials: opts.credentials ?? "same-origin",
  })

  const ct = res.headers.get("content-type") || ""
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "")

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "message" in (data as any)
        ? String((data as any).message)
        : `HTTP ${res.status}`
    throw new Error(msg)
  }

  return data as TResp
}

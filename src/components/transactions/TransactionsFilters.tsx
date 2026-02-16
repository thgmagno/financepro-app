/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client"

import { ChevronDown, Filter, RotateCcw, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Transaction, TransactionScope, TransactionStatus } from "@/types"
import clsx from "clsx"

function asStringArray(e: unknown): string[] {
  if (Array.isArray(e)) return e.map(String)
  if (typeof e === "object" && e) return Object.values(e as any).map(String)
  return []
}

type FormState = {
  scope: string
  type: string
  status: string
  from: string
  to: string
  q: string
}

export function TransactionsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const scopeOptions = React.useMemo(() => asStringArray(TransactionScope), [])
  const typeOptions = React.useMemo(() => asStringArray(Transaction), [])
  const statusOptions = React.useMemo(
    () => asStringArray(TransactionStatus),
    [],
  )

  const ALL = "__ALL__"

  const initial: FormState = React.useMemo(() => {
    return {
      scope: sp.get("scope") ?? ALL,
      type: sp.get("type") ?? ALL,
      status: sp.get("status") ?? ALL,
      from: sp.get("from") ?? "",
      to: sp.get("to") ?? "",
      q: sp.get("q") ?? "",
    }
  }, [sp])

  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<FormState>(initial)

  React.useEffect(() => {
    setForm(initial)
  }, [initial])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function clear() {
    setForm({
      scope: ALL,
      type: ALL,
      status: ALL,
      from: "",
      to: "",
      q: "",
    })
    router.push(pathname)
  }

  function apply() {
    const params = new URLSearchParams()

    if (form.scope && form.scope !== ALL) params.set("scope", form.scope)
    if (form.type && form.type !== ALL) params.set("type", form.type)
    if (form.status && form.status !== ALL) params.set("status", form.status)

    if (form.from) params.set("from", form.from)
    if (form.to) params.set("to", form.to)

    const qTrim = (form.q ?? "").trim()
    if (qTrim) params.set("q", qTrim)

    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    apply()
  }

  return (
    <Card className={clsx({ "pb-6": open })}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Filters</CardTitle>
            <CardDescription>
              Refine by scope, type, dates, pagination, and search.
            </CardDescription>
          </div>

          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {open ? "Hide" : "Show"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <CardContent>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 grid-cols-5 sm:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-6">
                <div className="space-y-2 col-span-5 sm:col-span-4 xl:col-span-1">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="e.g. grocery, rent, pix..."
                      value={form.q}
                      onChange={(e) => update("q", e.target.value)}
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-5 sm:col-span-2 xl:col-span-1">
                  <Label>From</Label>
                  <Input
                    type="date"
                    value={form.from}
                    onChange={(e) => update("from", e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-2 col-span-5 sm:col-span-2 xl:col-span-1">
                  <Label>To</Label>
                  <Input
                    type="date"
                    value={form.to}
                    onChange={(e) => update("to", e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-2 col-span-5 sm:col-span-2 xl:col-span-1">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => update("status", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="ALL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>ALL</SelectItem>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-5 sm:col-span-2 xl:col-span-1">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => update("type", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="ALL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>ALL</SelectItem>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-5 sm:col-span-2 xl:col-span-1">
                  <Label>Scope</Label>
                  <Select
                    value={form.scope}
                    onValueChange={(v) => update("scope", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="ALL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>ALL</SelectItem>
                      {scopeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2"
                  onClick={clear}
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
                <Button type="submit">Apply filters</Button>
              </div>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

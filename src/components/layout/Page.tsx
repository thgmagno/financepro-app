import clsx from "clsx"
import type { ReactNode } from "react"

interface PageContentProps {
  children: ReactNode
  centered?: boolean
}

export function Page({ children, centered = false }: PageContentProps) {
  return (
    <div
      className={clsx("flex min-h-dvh p-4 flex-col", {
        "items-center justify-center py-12": centered,
      })}
    >
      {children}
    </div>
  )
}

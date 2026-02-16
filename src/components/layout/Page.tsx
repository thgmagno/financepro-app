import clsx from "clsx"
import type { ReactNode } from "react"

interface PageContentProps {
  children: ReactNode
  centered?: boolean
}

export function Page({ children, centered = false }: PageContentProps) {
  return (
    <div
      className={clsx("flex flex-col p-4 gap-6 min-h-dvh", {
        "items-center justify-center py-12": centered,
      })}
    >
      {children}
    </div>
  )
}

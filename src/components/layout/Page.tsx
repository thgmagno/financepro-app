import clsx from "clsx"
import type { ReactNode } from "react"

interface PageContentProps {
  children: ReactNode
  centered?: boolean
  grid?: boolean
  cols?: 2 | 3
}

export function Page({
  children,
  centered = false,
  grid = false,
  cols = 2,
}: PageContentProps) {
  return (
    <div
      className={clsx("min-h-dvh p-4", {
        "flex flex-col": !grid,
        "items-center justify-center py-12": centered && !grid,

        "grid sm:gap-4": grid,
        "lg:grid-cols-2": grid && cols === 2,
        "lg:grid-cols-2 2xl:grid-cols-3": grid && cols === 3,
      })}
    >
      {children}
    </div>
  )
}

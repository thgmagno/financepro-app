import clsx from "clsx"
import type { ReactNode } from "react"

interface PageContentProps {
  children: ReactNode
  alignContent?: "center" | "left"
}

export function Page({ children, alignContent = "left" }: PageContentProps) {
  return (
    <div
      className={clsx("flex min-h-dvh p-4", {
        "items-center justify-center py-12": alignContent === "center",
        "flex-col": alignContent === "left",
      })}
    >
      {children}
    </div>
  )
}

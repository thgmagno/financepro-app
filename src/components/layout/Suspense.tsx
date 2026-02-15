import { Loader } from "lucide-react"
import type { ReactNode } from "react"
import { Suspense as SuspenseBoundary } from "react"

interface SuspenseProps {
  children: ReactNode
}

export function Suspense({ children }: SuspenseProps) {
  return (
    <SuspenseBoundary fallback={<Loader className="animate-spin" />}>
      {children}
    </SuspenseBoundary>
  )
}

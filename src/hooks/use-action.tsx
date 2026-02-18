"use client"

import type { createGroupAction, updateGroupAction } from "@/actions/group"
import type { batchUpdateTransactionsAction } from "@/actions/transaction"
import type React from "react"
import { createContext, useContext } from "react"

type Actions = {
  updateGroupAction: typeof updateGroupAction
  createGroupAction: typeof createGroupAction
  batchUpdateTransactionsAction: typeof batchUpdateTransactionsAction
}

const ActionsContext = createContext<Actions | null>(null)

export function ActionsProvider({
  actions,
  children,
}: {
  actions: Actions
  children: React.ReactNode
}) {
  return (
    <ActionsContext.Provider value={actions}>
      {children}
    </ActionsContext.Provider>
  )
}

export function useAction() {
  const ctx = useContext(ActionsContext)
  if (!ctx) {
    throw new Error("useAction must be used within ActionsProvider")
  }
  return ctx
}

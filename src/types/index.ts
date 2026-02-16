export type TransactionType = "INCOME" | "OUTCOME"
export type TransactionScope = "PRIVATE" | "GROUP"

export const SharePolicy = [
  "NONE",
  "ALL",
  "ABOVE_VALUE",
  "BELOW_VALUE",
] as const

export type SharePolicyType = (typeof SharePolicy)[number]

export interface Transaction {
  id: string
  createdAt: Date
  updatedAt: Date
  groupId: string | null
  expiresAt: Date | null
  description: string
  note: string | null
  amount: number
  type: TransactionType
  scope: TransactionScope
  occurredAt: Date | null
  effectiveAt: Date
  userId: string
}

export interface Group {
  id: string
  name: string
  members: number
  isAdmin: boolean
}

export interface Dashboard {
  transactions: Transaction[]
  group?: Group
  name: string
  email: string
  memberSince: Date
  sharePolicy: SharePolicyType
  sharePolicyValue: number | null
}

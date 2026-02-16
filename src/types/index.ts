export const Transaction = ["INCOME", "OUTCOME"] as const

export type TransactionType = (typeof Transaction)[number]

export const TransactionScope = ["PRIVATE", "GROUP"] as const

export type TransactionScopeType = (typeof TransactionScope)[number]

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
  scope: TransactionScopeType
  occurredAt: Date | null
  effectiveAt: Date
  userId: string
}

export interface GroupMember {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export interface Group {
  id: string
  name: string
  members: GroupMember[]
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

import z from "zod"

const schema = z.object({
  BASE_API_URL: z.url(),
})

const environment = schema.parse(process.env)

const publicRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  changePassword: "/change-password",
  requestChangePassword: "/request/change-password",
  requestSignUp: "/request/sign-up",
}

const routes = {
  // AUTH
  requestRegister: `${environment.BASE_API_URL}/auth/request/register`,
  register: `${environment.BASE_API_URL}/auth/register`,
  login: `${environment.BASE_API_URL}/auth/login`,
  requestChangePassword: `${environment.BASE_API_URL}/auth/request/change-password`,
  changePassword: `${environment.BASE_API_URL}/auth/change-password`,

  // ME (user)
  meChangePassword: `${environment.BASE_API_URL}/me/change-password`,
  meProfile: `${environment.BASE_API_URL}/me/profile`,

  // DASHBOARD
  dashboard: `${environment.BASE_API_URL}/dashboard`,

  // GROUP
  createGroup: `${environment.BASE_API_URL}/group`,
  updateGroup: (groupId: string) =>
    `${environment.BASE_API_URL}/group/${groupId}`,
  deleteGroup: (groupId: string) =>
    `${environment.BASE_API_URL}/group/${groupId}`,

  // TRANSACTIONS
  createTransaction: `${environment.BASE_API_URL}/transactions`,
  getTransaction: (transactionId: string) =>
    `${environment.BASE_API_URL}/transactions/${transactionId}`,
  listTransactions: `${environment.BASE_API_URL}/transactions`,
  batchUpdateTransactions: `${environment.BASE_API_URL}/transactions/batch`,
  updateTransaction: (transactionId: string) =>
    `${environment.BASE_API_URL}/transactions/${transactionId}`,
  deleteTransaction: (transactionId: string) =>
    `${environment.BASE_API_URL}/transactions/${transactionId}`,
}

export const config = {
  environment,
  routes,
  publicRoutes,
  accessTokenName: "finance-pro-access-token",
  sidebarStateTokenName: "finance-pro-sidebar-state",
}

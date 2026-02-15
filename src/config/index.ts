import z from "zod"

const schema = z.object({
  BASE_API_URL: z.url(),
  BFF_SHARED_SECRET: z.string(),
})

const environment = schema.parse(process.env)

export const config = {
  environment,
  accessTokenName: "finance-pro-access-token",
}

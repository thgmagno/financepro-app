import z from "zod"

const schema = z.object({
  BASE_API_URL: z.url(),
})

const environment = schema.parse(process.env)

export const config = {
  environment,
}

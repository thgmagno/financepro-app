import z from "zod"

export const RequestChangePasswordCodeSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
})

import z from "zod"

export const RequestSignUpFormSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
})

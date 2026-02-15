import { z } from "zod"

const MAX_255 = 255

export const SignUpSchema = z
  .object({
    email: z
      .email({
        error: "Invalid email address. Please try again.",
      })
      .max(MAX_255, { error: "Email must be 255 characters or less." }),

    name: z
      .string()
      .min(1, { error: "Enter your name." })
      .max(MAX_255, { error: "Name must be 255 characters or less." }),

    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .max(MAX_255, {
        error: "Password must be 255 characters or less.",
      }),

    passwordConfirmation: z
      .string()
      .min(1, { error: "Confirm your password." })
      .max(MAX_255, {
        error: "Password confirmation must be 255 characters or less.",
      }),

    confirmationCode: z
      .string()
      .length(6, { error: "Confirmation code must be 6 characters." }),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: "Passwords do not match.",
      })
    }
  })

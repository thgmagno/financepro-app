import { z } from "zod"

const MAX_255 = 255

export const SignUpFormSchema = z
  .object({
    email: z
      .email({
        message: "Invalid or expired sign-up link. Please request a new one.",
      })
      .max(MAX_255, { message: "Email must be 255 characters or less." }),

    name: z
      .string()
      .min(1, { message: "Enter your name." })
      .max(MAX_255, { message: "Name must be 255 characters or less." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(MAX_255, {
        message: "Password must be 255 characters or less.",
      }),

    passwordConfirmation: z
      .string()
      .min(1, { message: "Confirm your password." })
      .max(MAX_255, {
        message: "Password confirmation must be 255 characters or less.",
      }),

    confirmationCode: z
      .string()
      .min(1, { message: "Enter the confirmation code." })
      .length(6, { message: "Confirmation code must be 6 characters." }),
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

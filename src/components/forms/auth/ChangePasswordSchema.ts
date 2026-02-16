import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    email: z
      .email({
        error: "Invalid email address. Please try again.",
      })
      .max(255, { error: "Email must be 255 characters or less." }),

    newPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .max(255, {
        error: "Password must be 255 characters or less.",
      }),

    newPasswordConfirmation: z
      .string()
      .min(1, { error: "Confirm your password." })
      .max(255, {
        error: "Password confirmation must be 255 characters or less.",
      }),

    confirmationCode: z
      .string()
      .length(6, { error: "Confirmation code must be 6 characters." }),
  })
  .superRefine(({ newPassword, newPasswordConfirmation }, ctx) => {
    if (newPassword !== newPasswordConfirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["newPasswordConfirmation"],
        message: "Passwords do not match.",
      })
    }
  })

import { z } from "zod"

export const ChangeUserPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { error: "Enter your current password." }),

    newPassword: z
      .string()
      .min(1, { error: "Choose your new password." })
      .max(255, {
        error: "Password must be 255 characters or less.",
      }),

    newPasswordConfirmation: z
      .string()
      .min(1, { error: "Confirm your password." }),
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

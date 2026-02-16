import { SharePolicy } from "@/types"
import { z } from "zod"
import { MAX_255 } from "../auth/SignUpSchema"

export const UpdateUserProfileSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Enter your name." })
      .max(MAX_255, { message: "Name must be 255 characters or less." }),

    sharePolicy: z.enum(SharePolicy),

    sharePolicyValue: z
      .union([z.string().trim(), z.number(), z.null(), z.undefined()])
      .transform((v) => {
        if (v === null || v === undefined) return null
        if (typeof v === "number") return Number.isFinite(v) ? v : null
        if (v === "") return null

        const n = Number(v.replace(",", "."))
        return Number.isFinite(n) ? n : null
      }),
  })
  .superRefine((data, ctx) => {
    const needsValue =
      data.sharePolicy === "ABOVE_VALUE" || data.sharePolicy === "BELOW_VALUE"

    if (needsValue && data.sharePolicyValue === null) {
      ctx.addIssue({
        code: "custom",
        path: ["sharePolicyValue"],
        message: "Enter a value for this policy.",
      })
      return
    }

    if (!needsValue && data.sharePolicyValue !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["sharePolicyValue"],
        message: "This policy does not accept a value.",
      })
    }

    if (data.sharePolicyValue !== null && data.sharePolicyValue < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["sharePolicyValue"],
        message: "Value must be 0 or greater.",
      })
    }
  })

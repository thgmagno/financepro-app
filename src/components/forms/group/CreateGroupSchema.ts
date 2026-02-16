import { z } from "zod"

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Enter group name." })
    .max(20, { error: "Group name must be 20 characters or less." }),
})

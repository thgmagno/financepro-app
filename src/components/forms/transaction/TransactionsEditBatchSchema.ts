import { EMPTY } from "@/lib/strings.utils"
import { TransactionScope } from "@/types"
import { z } from "zod"

const uuid =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}"

const uuidCsvRegex = new RegExp(`^${uuid}(,${uuid})*$`)

export const TransactionsEditBatchSchema = z.object({
  transactionIds: z
    .string()
    .min(1, "transactionIds cannot be empty")
    .refine((value) => uuidCsvRegex.test(value), {
      message:
        "transactionIds must be a UUID or multiple UUIDs separated by comma",
    })
    .transform((value) => value.split(",")),

  scope: z.preprocess(
    (val) => (val === EMPTY ? undefined : val),
    z
      .enum(TransactionScope, { message: "Invalid transaction scope" })
      .optional(),
  ),
})

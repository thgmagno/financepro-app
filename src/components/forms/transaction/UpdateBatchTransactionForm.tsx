"use client"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAction } from "@/hooks/use-action"
import type { Transaction } from "@/types"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { TransactionsEditBatchSchema } from "./TransactionsEditBatchSchema"

export interface TransactionsEditBatchFormState {
  errors: {
    transactionIds?: string[]
    scope?: string[]
    _form?: string
  }
  successMessage?: string
}

type UpdateBatchTransactionFormProps = React.ComponentProps<"div"> & {
  transactions: Transaction[]
}

export function UpdateBatchTransactionForm({
  transactions,
  className,
  ...divProps
}: UpdateBatchTransactionFormProps) {
  const { batchUpdateTransactionsAction } = useAction()
  const [formState, action, isPending] = useActionState(
    batchUpdateTransactionsAction,
    { errors: {} },
  )

  const [clientErrors, setClientErrors] = useState<{
    transactionIds?: string[]
    scope?: string[]
  }>({})

  const transactionIds = Array.from(transactions.map((t) => t.id))

  const [scope, setScope] = useState("__EMPTY__")
  const [isDirty, setIsDirty] = useState([scope].some((f) => f !== ""))

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    if (!isDirty) {
      e.preventDefault()
      return
    }

    const formData = new FormData(e.currentTarget)
    const parsed = TransactionsEditBatchSchema.safeParse(
      Object.fromEntries(formData),
    )

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        transactionIds: tree?.properties?.transactionIds?.errors,
        scope: tree?.properties?.scope?.errors,
      })

      return
    }

    setClientErrors({})
  }

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
    if (formState.successMessage) {
      toast.success(formState.successMessage)
      setIsDirty(false)
    }
  }, [formState])

  const scopeErrors = clientErrors.scope ?? formState.errors.scope

  return (
    <form action={action} onSubmit={onSubmit}>
      <input type="hidden" name="transactionIds" value={transactionIds} />

      <div className={className} {...divProps}>
        <FieldSet>
          <FieldGroup>
            <Field
              data-invalid={!!scopeErrors}
              className="md:grid md:grid-cols-4"
            >
              <FieldLabel htmlFor="scope">Scope</FieldLabel>
              <Select
                name="scope"
                value={scope}
                onValueChange={(e) => {
                  setScope(e)
                  setIsDirty(true)
                }}
              >
                <SelectTrigger id="scope" className="md:col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__EMPTY__">Keep current</SelectItem>
                    <SelectItem value="PRIVATE">Set private</SelectItem>
                    <SelectItem value="GROUP">Set group</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>{scopeErrors}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      <div className="flex items-center justify-end mt-6 gap-2">
        <FormSubmitButton
          label="Save changes"
          isPending={isPending}
          disabled={!isDirty}
        />
      </div>
    </form>
  )
}

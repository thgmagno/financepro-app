"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { UpdateGroupSchema } from "./UpdateGroupSchema"

export interface UpdateGroupFormState {
  errors: {
    name?: string[]
    _form?: string
  }
  success?: boolean
}

interface UpdateGroupFormProps {
  groupName: string
  updateGroupAction(
    formState: UpdateGroupFormState,
    formData: FormData,
  ): Promise<UpdateGroupFormState>
}

export function UpdateGroupForm({
  groupName,
  updateGroupAction,
}: UpdateGroupFormProps) {
  const [formState, action, isPending] = useActionState(updateGroupAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{
    name?: string[]
  }>({})

  const [name, setName] = useState(groupName)

  const [isDirty, setIsDirty] = useState(name !== groupName)

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    if (!isDirty) {
      e.preventDefault()
      return
    }

    const formData = new FormData(e.currentTarget)
    const parsed = UpdateGroupSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        name: tree?.properties?.name?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const nameErrors = clientErrors.name ?? formState.errors.name

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
    if (formState.success) {
      toast.success("Group updated successfully")
      setIsDirty(false)
    }
  }, [formState])

  return (
    <form action={action} onSubmit={onSubmit} className="px-4">
      <FieldSet>
        <FieldGroup className="flex gap-4 flex-row items-end">
          <Field data-invalid={!!nameErrors}>
            <FieldLabel htmlFor="name">Group name</FieldLabel>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIsDirty(true)
              }}
              placeholder="Group name"
              aria-invalid={!!nameErrors}
              autoCorrect="off"
              spellCheck={false}
            />
            <FieldError>{nameErrors}</FieldError>
          </Field>
          <Button
            type="submit"
            size="icon-sm"
            className="mb-0.5"
            disabled={isPending || !isDirty}
          >
            <Check />
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { CreateGroupSchema } from "./CreateGroupSchema"

export interface CreateGroupFormState {
  errors: {
    name?: string[]
    _form?: string
  }
}

interface CreateGroupFormProps {
  createGroupAction(
    formState: CreateGroupFormState,
    formData: FormData,
  ): Promise<CreateGroupFormState>
}

export function CreateGroupForm({ createGroupAction }: CreateGroupFormProps) {
  const [formState, action, isPending] = useActionState(createGroupAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{
    name?: string[]
  }>({})

  const [name, setName] = useState("")

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = CreateGroupSchema.safeParse(Object.fromEntries(formData))

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
  }, [formState])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create a new group</CardTitle>
        <CardDescription>
          Choose a name for your group to start inviting members and organizing
          your space.
        </CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
          {/* Name */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!nameErrors}>
                <FieldLabel htmlFor="name">Group name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Group name"
                  aria-invalid={!!nameErrors}
                  autoCorrect="off"
                  spellCheck={false}
                />
                <FieldError>{nameErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <FormSubmitButton label="Create" isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

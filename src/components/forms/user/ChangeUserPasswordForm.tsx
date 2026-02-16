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
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { ChangeUserPasswordSchema } from "./ChangeUserPasswordSchema"

export interface ChangeUserPasswordFormState {
  errors: {
    oldPassword?: string[]
    newPassword?: string[]
    newPasswordConfirmation?: string[]
    _form?: string
  }
  successMessage?: string
}

interface ChangeUserPasswordFormProps {
  changeUserPasswordAction(
    formState: ChangeUserPasswordFormState,
    formData: FormData,
  ): Promise<ChangeUserPasswordFormState>
}

export function ChangeUserPasswordForm({
  changeUserPasswordAction,
}: ChangeUserPasswordFormProps) {
  const [formState, action, isPending] = useActionState(
    changeUserPasswordAction,
    {
      errors: {},
    },
  )

  const [clientErrors, setClientErrors] = useState<{
    oldPassword?: string[]
    newPassword?: string[]
    newPasswordConfirmation?: string[]
  }>({})

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = ChangeUserPasswordSchema.safeParse(
      Object.fromEntries(formData),
    )

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        oldPassword: tree?.properties?.oldPassword?.errors,
        newPassword: tree?.properties?.newPassword?.errors,
        newPasswordConfirmation:
          tree?.properties?.newPasswordConfirmation?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const oldPasswordErrors =
    clientErrors.oldPassword ?? formState.errors.oldPassword
  const newPasswordErrors =
    clientErrors.newPassword ?? formState.errors.newPassword
  const newPasswordConfirmationErrors =
    clientErrors.newPasswordConfirmation ??
    formState.errors.newPasswordConfirmation

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
    if (formState.successMessage) {
      toast.success(formState.successMessage)
    }
  }, [formState])

  const newPasswordRef = useRef<HTMLButtonElement>(null)
  const newPasswordConfirmationRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Update your password</CardTitle>
        <CardDescription>Set a new password for your account.</CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
          {/* oldPassword */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!oldPasswordErrors}>
                <FieldLabel htmlFor="oldPasswordErrors">
                  Current password
                </FieldLabel>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  aria-invalid={!!oldPasswordErrors}
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      newPasswordRef.current?.focus()
                    }
                  }}
                />
                <FieldError>{oldPasswordErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* newPassword */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!newPasswordErrors}>
                <FieldLabel htmlFor="newPasswordErrors">
                  New password
                </FieldLabel>
                <Input
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                  aria-invalid={!!newPasswordErrors}
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      newPasswordConfirmationRef.current?.focus()
                    }
                  }}
                />
                <FieldError>{newPasswordErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* newPasswordConfirmation */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!newPasswordConfirmationErrors}>
                <FieldLabel htmlFor="newPasswordConfirmation">
                  Confirm new password
                </FieldLabel>
                <Input
                  id="newPasswordConfirmation"
                  name="newPasswordConfirmation"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  placeholder="Re-enter the new password"
                  aria-invalid={!!newPasswordConfirmationErrors}
                  autoCorrect="off"
                  spellCheck={false}
                />
                <FieldError>{newPasswordConfirmationErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <FormSubmitButton label="Update password" isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

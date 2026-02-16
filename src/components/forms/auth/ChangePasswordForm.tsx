"use client"

import { Button, buttonVariants } from "@/components/ui/button"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { ChangePasswordSchema } from "./ChangePasswordSchema"

export interface ChangePasswordFormState {
  errors: {
    email?: string[]
    newPassword?: string[]
    newPasswordConfirmation?: string[]
    confirmationCode?: string[]
    _form?: string
  }
}

interface ChangePasswordFormProps {
  changePasswordAction(
    formState: ChangePasswordFormState,
    formData: FormData,
  ): Promise<ChangePasswordFormState>
}

export function ChangePasswordForm({
  changePasswordAction,
}: ChangePasswordFormProps) {
  const [formState, action, isPending] = useActionState(changePasswordAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{
    email?: string[]
    newPassword?: string[]
    newPasswordConfirmation?: string[]
    confirmationCode?: string[]
  }>({})

  const [email, setEmail] = useState(useSearchParams().get("email") ?? "")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")

  const [passwordVisible, setPasswordVisible] = useState(false)

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = ChangePasswordSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        email: tree?.properties?.email?.errors,
        newPassword: tree?.properties?.newPassword?.errors,
        newPasswordConfirmation:
          tree?.properties?.newPasswordConfirmation?.errors,
        confirmationCode: tree?.properties?.confirmationCode?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const emailErrors = clientErrors.email ?? formState.errors.email
  const newPasswordErrors =
    clientErrors.newPassword ?? formState.errors.newPassword
  const newPasswordConfirmationErrors =
    clientErrors.newPasswordConfirmation ??
    formState.errors.newPasswordConfirmation
  const confirmationCodeErrors =
    clientErrors.confirmationCode ?? formState.errors.confirmationCode

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
  }, [formState])

  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter the verification code from your email and choose a new password
          to regain access to your account.
        </CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
          {/* Email (readOnly) */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!emailErrors}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name="email"
                  value={email}
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!emailErrors}
                  placeholder="m@example.com"
                  readOnly
                />
                <FieldError>{emailErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Confirmation code */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!confirmationCodeErrors}>
                <FieldLabel htmlFor="confirmationCode">
                  Verification code
                </FieldLabel>
                <Input
                  name="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="XXXXXX"
                  aria-invalid={!!confirmationCodeErrors}
                  className="uppercase"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      passwordRef.current?.focus()
                    }
                  }}
                />
                <FieldError>{confirmationCodeErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Password */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!newPasswordErrors}>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    tabIndex={-1}
                  >
                    {passwordVisible ? "Hide" : "Show"} password
                  </Button>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                <Input
                  ref={passwordRef}
                  name="newPassword"
                  type={passwordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Your secure password"
                  aria-invalid={!!newPasswordErrors}
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      confirmPasswordRef.current?.focus()
                    }
                  }}
                />
                <FieldError>{newPasswordErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Password confirmation */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!newPasswordConfirmationErrors}>
                <FieldLabel htmlFor="passwordConfirmation">
                  Confirm your new password
                </FieldLabel>
                <Input
                  ref={confirmPasswordRef}
                  name="newPasswordConfirmation"
                  type={passwordVisible ? "text" : "password"}
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  placeholder="Confirm your password"
                  aria-invalid={!!newPasswordConfirmationErrors}
                />
                <FieldError>{newPasswordConfirmationErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Link
            href="/request/change-password"
            className={buttonVariants({ variant: "ghost" })}
          >
            Cancel
          </Link>
          <FormSubmitButton label="Confirm" isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

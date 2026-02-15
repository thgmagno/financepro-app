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
import { Loader } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState, useState } from "react"
import z from "zod"
import { SignUpFormSchema } from "./SignUpFormSchema"

export interface SignUpFormState {
  errors: {
    email?: string[]
    confirmationCode?: string[]
    name?: string[]
    password?: string[]
    passwordConfirmation?: string[]
    _form?: string
  }
}

interface SignUpFormProps {
  signUpAction(
    formState: SignUpFormState,
    formData: FormData,
  ): Promise<SignUpFormState>
}

export function SignUpForm({ signUpAction }: SignUpFormProps) {
  const [formState, action, isPending] = useActionState(signUpAction, {
    errors: {},
  })
  const [clientErrors, setClientErrors] = useState<{
    email?: string[]
    confirmationCode?: string[]
    name?: string[]
    password?: string[]
    passwordConfirmation?: string[]
  }>({})

  const email = useSearchParams().get("email") ?? ""

  const [confirmationCode, setConfirmationCode] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")

  const [passwordVisible, setPasswordVisible] = useState(false)

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = SignUpFormSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        email: tree?.properties?.email?.errors,
        confirmationCode: tree?.properties?.confirmationCode?.errors,
        name: tree?.properties?.name?.errors,
        password: tree?.properties?.password?.errors,
        passwordConfirmation: tree?.properties?.passwordConfirmation?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const emailErrors = clientErrors.email ?? formState.errors.email
  const confirmationCodeErrors =
    clientErrors.confirmationCode ?? formState.errors.confirmationCode
  const nameErrors = clientErrors.name ?? formState.errors.name
  const passwordErrors = clientErrors.password ?? formState.errors.password
  const passwordConfirmationErrors =
    clientErrors.passwordConfirmation ?? formState.errors.passwordConfirmation

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify your email and create your account</CardTitle>
        <CardDescription>
          Use the verification code from your inbox and choose your name and
          password to get started.
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
                  defaultValue={email}
                  aria-invalid={!!emailErrors}
                  disabled
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
                <FieldDescription>
                  You will receive a code to complete the registration.
                </FieldDescription>
                <Input
                  name="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  aria-invalid={!!confirmationCodeErrors}
                  className="uppercase"
                />
                <FieldError>{confirmationCodeErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Name */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!nameErrors}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!nameErrors}
                />
                <FieldError>{nameErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Password */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!passwordErrors}>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!passwordErrors}
                />
                <FieldError>{passwordErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Password confirmation */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!passwordConfirmationErrors}>
                <FieldLabel htmlFor="passwordConfirmation">
                  Confirm your password
                </FieldLabel>
                <Input
                  name="passwordConfirmation"
                  type={passwordVisible ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  aria-invalid={!!passwordConfirmationErrors}
                />
                <FieldError>{passwordConfirmationErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Link
            href="/request/sign-up"
            className={buttonVariants({ variant: "ghost" })}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Send
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

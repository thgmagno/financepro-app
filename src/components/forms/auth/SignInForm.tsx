"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { SignInSchema } from "./SignInSchema"

export interface SignInFormState {
  errors: {
    email?: string[]
    confirmationCode?: string[]
    name?: string[]
    password?: string[]
    passwordConfirmation?: string[]
    _form?: string
  }
}

interface SignInFormProps {
  signInAction(
    formState: SignInFormState,
    formData: FormData,
  ): Promise<SignInFormState>
}

export function SignInForm({ signInAction }: SignInFormProps) {
  const [formState, action, isPending] = useActionState(signInAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{
    email?: string[]
    password?: string[]
  }>({})

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [passwordVisible, setPasswordVisible] = useState(false)

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = SignInSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        email: tree?.properties?.email?.errors,
        password: tree?.properties?.password?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const emailErrors = clientErrors.email ?? formState.errors.email
  const passwordErrors = clientErrors.password ?? formState.errors.password

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
  }, [formState])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
        <CardAction>
          <Link
            href="/request/sign-up"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Sign Up
          </Link>
        </CardAction>
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  aria-invalid={!!emailErrors}
                />
                <FieldError>{emailErrors}</FieldError>
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
                <Input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secure password"
                  aria-invalid={!!passwordErrors}
                />
                <FieldError>{passwordErrors}</FieldError>
                <div className="flex items-center justify-end">
                  <Link
                    href="/request/change-password"
                    className={buttonVariants({ variant: "link", size: "sm" })}
                  >
                    Forgot your password?
                  </Link>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <FormSubmitButton label="Login" isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

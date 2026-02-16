"use client"

import { buttonVariants } from "@/components/ui/button"
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
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { RequestChangePasswordCodeSchema } from "./RequestChangePasswordCodeSchema"

export interface RequestChangePasswordCodeFormState {
  errors: {
    email?: string[]
    _form?: string
  }
}

interface RequestChangePasswordCodeFormProps {
  requestChangePasswordAction(
    formState: RequestChangePasswordCodeFormState,
    formData: FormData,
  ): Promise<RequestChangePasswordCodeFormState>
}

export function RequestChangePasswordCodeForm({
  requestChangePasswordAction,
}: RequestChangePasswordCodeFormProps) {
  const [formState, action, isPending] = useActionState(
    requestChangePasswordAction,
    {
      errors: {},
    },
  )

  const [clientErrors, setClientErrors] = useState<{ email?: string[] }>({})

  const [email, setEmail] = useState("")

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = RequestChangePasswordCodeSchema.safeParse(
      Object.fromEntries(formData),
    )

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        email: tree?.properties?.email?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const emailErrors = clientErrors.email ?? formState.errors.email

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
  }, [formState])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset code.
        </CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!emailErrors}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  aria-invalid={!!emailErrors}
                />
                <FieldError>{emailErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "ghost" })}
          >
            Cancel
          </Link>
          <FormSubmitButton label="Continue" isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  )
}

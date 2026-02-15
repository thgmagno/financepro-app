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
import { RequestSignUpFormSchema } from "./RequestSignUpCodeSchema"

export interface RequestSignUpCodeFormState {
  errors: {
    email?: string[]
    _form?: string
  }
}

interface RequestSignUpCodeFormProps {
  requestSignUpAction(
    formState: RequestSignUpCodeFormState,
    formData: FormData,
  ): Promise<RequestSignUpCodeFormState>
}

export function RequestSignUpCodeForm({
  requestSignUpAction,
}: RequestSignUpCodeFormProps) {
  const [formState, action, isPending] = useActionState(requestSignUpAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{ email?: string[] }>({})

  const [email, setEmail] = useState("")

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)
    const parsed = RequestSignUpFormSchema.safeParse(
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
        <CardTitle>Email verification</CardTitle>
        <CardDescription>
          Enter your email to receive a verification code.
        </CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
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

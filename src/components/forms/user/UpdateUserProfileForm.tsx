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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SharePolicy, type SharePolicyType } from "@/types"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FormSubmitButton } from "../FormSubmitButton"
import { UpdateUserProfileSchema } from "./UpdateUserProfileSchema"

export interface UpdateUserProfileFormState {
  errors: {
    name?: string[]
    sharePolicy?: string[]
    sharePolicyValue?: string[]
    _form?: string
  }
  successMessage?: string
}

interface UpdateUserProfileFormProps {
  userName: string
  userSharePolicy: SharePolicyType
  userSharePolicyValue: number | null
  updateProfileAction(
    formState: UpdateUserProfileFormState,
    formData: FormData,
  ): Promise<UpdateUserProfileFormState>
}

export function UpdateUserProfileForm({
  userName,
  userSharePolicy,
  userSharePolicyValue,
  updateProfileAction,
}: UpdateUserProfileFormProps) {
  const [formState, action, isPending] = useActionState(updateProfileAction, {
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<{
    name?: string[]
    sharePolicy?: string[]
    sharePolicyValue?: string[]
  }>({})

  const [name, setName] = useState(userName)
  const [sharePolicy, setSharePolicy] = useState(userSharePolicy)
  const [sharePolicyValue, setSharePolicyValue] = useState(
    userSharePolicyValue ?? "",
  )

  const [isDirty, setIsDirty] = useState(
    name !== userName || sharePolicy !== userSharePolicy,
  )

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    if (!isDirty) {
      e.preventDefault()
      return
    }

    const formData = new FormData(e.currentTarget)
    const parsed = UpdateUserProfileSchema.safeParse(
      Object.fromEntries(formData),
    )

    if (!parsed.success) {
      e.preventDefault()

      const tree = z.treeifyError(parsed.error)
      setClientErrors({
        name: tree?.properties?.name?.errors,
        sharePolicy: tree?.properties?.sharePolicy?.errors,
        sharePolicyValue: tree?.properties?.sharePolicyValue?.errors,
      })

      return
    }

    setClientErrors({})
  }

  const nameErrors = clientErrors.name ?? formState.errors.name
  const sharePolicyErrors =
    clientErrors.sharePolicy ?? formState.errors.sharePolicy
  const sharePolicyValueErrors =
    clientErrors.sharePolicyValue ?? formState.errors.sharePolicyValue

  useEffect(() => {
    if (formState.errors._form) {
      toast.error(formState.errors._form)
    }
    if (formState.successMessage) {
      toast.success(formState.successMessage)
      setIsDirty(false)
    }
  }, [formState])

  const sharePolicyRef = useRef<HTMLButtonElement>(null)
  const sharePolicyValueRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Update profile</CardTitle>
        <CardDescription>
          Review and update your account settings.
        </CardDescription>
      </CardHeader>
      <form action={action} onSubmit={onSubmit}>
        <CardContent>
          {/* Name */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!nameErrors}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setIsDirty(true)
                  }}
                  placeholder="Your name"
                  aria-invalid={!!nameErrors}
                  autoCorrect="off"
                  autoComplete="name"
                  spellCheck={false}
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      sharePolicyRef.current?.focus()
                    }
                  }}
                />
                <FieldError>{nameErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* SharePolicy */}
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={!!sharePolicyErrors}>
                <FieldLabel htmlFor="sharePolicy">Share policy</FieldLabel>
                <FieldDescription>
                  Choose how your data can be shared.
                </FieldDescription>
                <Select
                  name="sharePolicy"
                  value={sharePolicy}
                  onValueChange={(e) => {
                    setSharePolicy(e as SharePolicyType)
                    setIsDirty(true)
                  }}
                >
                  <SelectTrigger id="sharePolicy" ref={sharePolicyRef}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SharePolicy.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{sharePolicyErrors}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* SharePolicyValue */}
          {["ABOVE_VALUE", "BELOW_VALUE"].includes(sharePolicy) && (
            <FieldSet>
              <FieldGroup>
                <Field data-invalid={!!sharePolicyValueErrors}>
                  <FieldLabel htmlFor="sharePolicyValue">Value</FieldLabel>
                  <Input
                    ref={sharePolicyValueRef}
                    id="sharePolicyValue"
                    name="sharePolicyValue"
                    type="tel"
                    value={sharePolicyValue}
                    onChange={(e) => {
                      setSharePolicyValue(e.target.value)
                      setIsDirty(true)
                    }}
                    aria-invalid={!!sharePolicyValueErrors}
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <FieldError>{sharePolicyValueErrors}</FieldError>
                </Field>
              </FieldGroup>
            </FieldSet>
          )}
        </CardContent>
        <CardFooter>
          <FormSubmitButton
            label="Save changes"
            isPending={isPending}
            disabled={!isDirty}
          />
        </CardFooter>
      </form>
    </Card>
  )
}

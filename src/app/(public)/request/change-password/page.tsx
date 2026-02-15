import {
  RequestChangePasswordCodeForm,
  type RequestChangePasswordCodeFormState,
} from "@/components/forms/auth/RequestChangePasswordCodeForm"
import { RequestChangePasswordCodeSchema } from "@/components/forms/auth/RequestChangePasswordCodeSchema"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { redirect } from "next/navigation"
import z from "zod"

async function requestChangePasswordAction(
  _formState: RequestChangePasswordCodeFormState,
  formData: FormData,
): Promise<RequestChangePasswordCodeFormState> {
  "use server"

  const parsed = RequestChangePasswordCodeSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return { errors: { email: tree?.properties?.email?.errors } }
  }

  try {
    const res = await fetch(config.routes.requestChangePassword, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: parsed.data.email }),
    })

    const r = await res.json()

    if (!res.ok) {
      return { errors: { _form: r.message } }
    }
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }

  redirect(`/change-password?email=${parsed.data.email}`)
}

export default function RequestChangePassword() {
  return (
    <Page centered>
      <RequestChangePasswordCodeForm
        requestChangePasswordAction={requestChangePasswordAction}
      />
    </Page>
  )
}

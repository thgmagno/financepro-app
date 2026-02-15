import {
  RequestSignUpCodeForm,
  type RequestSignUpCodeFormState,
} from "@/components/forms/auth/RequestSignUpCodeForm"
import { RequestSignUpFormSchema } from "@/components/forms/auth/RequestSignUpCodeSchema"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { redirect } from "next/navigation"
import z from "zod"

async function requestSignUpAction(
  _formState: RequestSignUpCodeFormState,
  formData: FormData,
): Promise<RequestSignUpCodeFormState> {
  "use server"

  const parsed = RequestSignUpFormSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return { errors: { email: tree?.properties?.email?.errors } }
  }

  try {
    const res = await fetch(config.routes.requestRegister, {
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

  redirect(`/sign-up?email=${parsed.data.email}`)
}

export default function RequestSignUp() {
  return (
    <Page centered>
      <RequestSignUpCodeForm requestSignUpAction={requestSignUpAction} />
    </Page>
  )
}

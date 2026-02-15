import {
  RequestSignUpCodeForm,
  type RequestSignUpCodeFormState,
} from "@/components/forms/auth/RequestSignUpCodeForm"
import { RequestSignUpFormSchema } from "@/components/forms/auth/RequestSignUpCodeSchema"
import { Page } from "@/components/layout/Page"
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

  redirect(`/sign-up?email=${parsed.data.email}`)
}

export default function RequestSignUp() {
  return (
    <Page centered>
      <RequestSignUpCodeForm requestSignUpAction={requestSignUpAction} />
    </Page>
  )
}

import {
  RequestChangePasswordCodeForm,
  type RequestChangePasswordCodeFormState,
} from "@/components/forms/auth/RequestChangePasswordCodeForm"
import { RequestChangePasswordCodeSchema } from "@/components/forms/auth/RequestChangePasswordCodeSchema"
import { Page } from "@/components/layout/Page"
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

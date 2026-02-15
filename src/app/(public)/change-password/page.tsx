import {
  ChangePasswordForm,
  type ChangePasswordFormState,
} from "@/components/forms/auth/ChangePasswordForm"
import { ChangePasswordSchema } from "@/components/forms/auth/ChangePasswordSchema"
import { Page } from "@/components/layout/Page"
import { redirect } from "next/navigation"
import z from "zod"

async function changePasswordAction(
  _formState: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  "use server"

  const parsed = ChangePasswordSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        email: tree?.properties?.email?.errors,
        newPassword: tree?.properties?.newPassword?.errors,
        newPasswordConfirmation:
          tree?.properties?.newPasswordConfirmation?.errors,
        confirmationCode: tree?.properties?.confirmationCode?.errors,
      },
    }
  }

  redirect("/sign-in")
}

export default function ChangePassword() {
  return (
    <Page centered>
      <ChangePasswordForm changePasswordAction={changePasswordAction} />
    </Page>
  )
}

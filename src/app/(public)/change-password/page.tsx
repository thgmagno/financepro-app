import {
  ChangePasswordForm,
  type ChangePasswordFormState,
} from "@/components/forms/auth/ChangePasswordForm"
import { ChangePasswordSchema } from "@/components/forms/auth/ChangePasswordSchema"
import { Page } from "@/components/layout/Page"
import { Suspense } from "@/components/layout/Suspense"
import { config } from "@/config"
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

  try {
    const res = await fetch(config.routes.changePassword, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        confirmationCode: String(parsed.data.confirmationCode).toUpperCase(),
        newPassword: parsed.data.newPassword,
        newPasswordConfirmation: parsed.data.newPasswordConfirmation,
      }),
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

  redirect("/sign-in")
}

export default function ChangePassword() {
  return (
    <Page centered>
      <Suspense>
        <ChangePasswordForm changePasswordAction={changePasswordAction} />
      </Suspense>
    </Page>
  )
}

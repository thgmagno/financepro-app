import { getDashboard } from "@/actions/dashboard"
import { getToken, getUserIdFromJwt } from "@/actions/session"
import {
  ChangeUserPasswordForm,
  type ChangeUserPasswordFormState,
} from "@/components/forms/user/ChangeUserPasswordForm"
import { ChangeUserPasswordSchema } from "@/components/forms/user/ChangeUserPasswordSchema"
import {
  UpdateUserProfileForm,
  type UpdateUserProfileFormState,
} from "@/components/forms/user/UpdateUserProfileForm"
import { UpdateUserProfileSchema } from "@/components/forms/user/UpdateUserProfileSchema"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { revalidateTag } from "next/cache"
import z from "zod"

async function updateProfileAction(
  _formState: UpdateUserProfileFormState,
  formData: FormData,
): Promise<UpdateUserProfileFormState> {
  "use server"

  const parsed = UpdateUserProfileSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        name: tree?.properties?.name?.errors,
        sharePolicy: tree?.properties?.sharePolicy?.errors,
        sharePolicyValue: tree?.properties?.sharePolicyValue?.errors,
      },
    }
  }

  try {
    const token = await getToken()
    const res = await fetch(config.routes.meProfile, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: parsed.data.name,
        sharePolicy: parsed.data.sharePolicy,
        sharePolicyValue: parsed.data.sharePolicyValue,
      }),
    })

    const r = await res.json()

    if (!res.ok) {
      return { errors: { _form: r.message } }
    }

    if (token) {
      const userId = await getUserIdFromJwt(token)
      revalidateTag(`dashboard:${userId}`, "max")
    }

    return { errors: {}, successMessage: r.data.message }
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }
}

async function changeUserPasswordAction(
  _formState: ChangeUserPasswordFormState,
  formData: FormData,
): Promise<ChangeUserPasswordFormState> {
  "use server"

  const parsed = ChangeUserPasswordSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        oldPassword: tree?.properties?.oldPassword?.errors,
        newPassword: tree?.properties?.newPassword?.errors,
        newPasswordConfirmation:
          tree?.properties?.newPasswordConfirmation?.errors,
      },
    }
  }

  try {
    const token = await getToken()
    const res = await fetch(config.routes.meChangePassword, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: parsed.data.oldPassword,
        newPassword: parsed.data.newPassword,
        newPasswordConfirmation: parsed.data.newPasswordConfirmation,
      }),
    })

    const r = await res.json()

    if (!res.ok) {
      return { errors: { _form: r.message } }
    }

    return { errors: {}, successMessage: r.data.message }
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }
}

export default async function Settings() {
  const { data } = await getDashboard()

  return (
    <Page>
      <UpdateUserProfileForm
        userName={data.name}
        userSharePolicy={data.sharePolicy}
        userSharePolicyValue={data.sharePolicyValue}
        updateProfileAction={updateProfileAction}
      />
      <ChangeUserPasswordForm
        changeUserPasswordAction={changeUserPasswordAction}
      />
    </Page>
  )
}

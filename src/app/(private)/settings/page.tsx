import { getDashboard } from "@/actions/dashboard"
import { getToken, getUserIdFromJwt } from "@/actions/session"
import { ChangeUserPasswordForm } from "@/components/forms/user/ChangeUserPasswordForm"
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
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }

  return { errors: {} }
}

export default async function Settings() {
  const { data } = await getDashboard()

  return (
    <Page grid cols={3}>
      <UpdateUserProfileForm
        userName={data.name}
        userSharePolicy={data.sharePolicy}
        userSharePolicyValue={data.sharePolicyValue}
        updateProfileAction={updateProfileAction}
      />
      <ChangeUserPasswordForm />
    </Page>
  )
}

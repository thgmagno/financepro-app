import { getDashboard } from "@/actions/dashboard"
import { getToken, getUserIdFromJwt } from "@/actions/session"
import {
  CreateGroupForm,
  type CreateGroupFormState,
} from "@/components/forms/group/CreateGroupForm"
import { CreateGroupSchema } from "@/components/forms/group/CreateGroupSchema"
import type { UpdateGroupFormState } from "@/components/forms/group/UpdateGroupForm"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"
import { GroupDetails } from "./GroupView"

async function createGroupAction(
  _formState: CreateGroupFormState,
  formData: FormData,
): Promise<CreateGroupFormState> {
  "use server"

  const parsed = CreateGroupSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        name: tree?.properties?.name?.errors,
      },
    }
  }

  try {
    const token = await getToken()
    const res = await fetch(config.routes.createGroup, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: parsed.data.name,
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

  redirect("/")
}

async function updateGroupAction(
  groupId: string | undefined,
  _formState: CreateGroupFormState,
  formData: FormData,
): Promise<UpdateGroupFormState> {
  "use server"

  if (!groupId) {
    return {
      errors: {
        _form: "ID group does not provided.",
      },
    }
  }

  const parsed = CreateGroupSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        name: tree?.properties?.name?.errors,
      },
    }
  }

  try {
    const token = await getToken()
    const res = await fetch(config.routes.updateGroup(groupId), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: parsed.data.name,
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

    return { errors: {}, success: true }
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }
}

export default async function Group() {
  const { data } = await getDashboard()

  return (
    <Page>
      {data.group ? (
        <GroupDetails
          group={data.group}
          currentUserEmail={data.email}
          updateGroupAction={updateGroupAction.bind(null, data.group.id)}
        />
      ) : (
        <CreateGroupForm createGroupAction={createGroupAction} />
      )}
    </Page>
  )
}

"use server"

import type { CreateGroupFormState } from "@/components/forms/group/CreateGroupForm"
import { CreateGroupSchema } from "@/components/forms/group/CreateGroupSchema"
import type { UpdateGroupFormState } from "@/components/forms/group/UpdateGroupForm"
import { config } from "@/config"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"
import { getToken, getUserIdFromJwt } from "./session"

export async function createGroupAction(
  _formState: CreateGroupFormState,
  formData: FormData,
): Promise<CreateGroupFormState> {
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

export async function updateGroupAction(
  _formState: CreateGroupFormState,
  formData: FormData,
): Promise<UpdateGroupFormState> {
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
    const res = await fetch(config.routes.updateGroup, {
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

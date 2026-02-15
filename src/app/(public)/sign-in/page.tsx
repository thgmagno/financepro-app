import {
  SignInForm,
  type SignInFormState,
} from "@/components/forms/auth/SignInForm"
import { SignInSchema } from "@/components/forms/auth/SignInSchema"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod"

async function signInAction(
  _formState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  "use server"

  const parsed = SignInSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        email: tree?.properties?.email?.errors,
        password: tree?.properties?.password?.errors,
      },
    }
  }

  try {
    const res = await fetch(config.routes.login, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    })

    const r = await res.json()

    if (!res.ok) {
      return { errors: { _form: r.message } }
    }

    if (r.data?.accessToken) {
      const cookieStore = await cookies()
      cookieStore.set(config.accessTokenName, r.data.accessToken)
    }
  } catch (ex) {
    console.log(ex)
    return {
      errors: { _form: "Failed to fetch" },
    }
  }

  redirect("/")
}

export default function SignIn() {
  return (
    <Page centered>
      <SignInForm signInAction={signInAction} />
    </Page>
  )
}

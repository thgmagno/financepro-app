import {
  SignUpForm,
  type SignUpFormState,
} from "@/components/forms/auth/SignUpForm"
import { SignUpSchema } from "@/components/forms/auth/SignUpSchema"
import { Page } from "@/components/layout/Page"
import { config } from "@/config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod"

async function signUpAction(
  _formState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  "use server"

  const parsed = SignUpSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)

    return {
      errors: {
        email: tree?.properties?.email?.errors,
        confirmationCode: tree?.properties?.confirmationCode?.errors,
        name: tree?.properties?.name?.errors,
        password: tree?.properties?.password?.errors,
        passwordConfirmation: tree?.properties?.passwordConfirmation?.errors,
      },
    }
  }

  try {
    const res = await fetch(
      `${config.environment.BASE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsed.data.email,
          confirmationCode: parsed.data.confirmationCode,
          name: parsed.data.name,
          password: parsed.data.password,
          passwordConfirmation: parsed.data.passwordConfirmation,
        }),
      },
    )

    if (res.ok) {
      const r = await res.json()
      if (r.data?.accessToken) {
        const cookieStore = await cookies()
        cookieStore.set(config.accessTokenName, r.data.accessToken)
      }
    }
  } catch {
    return {
      errors: { _form: "Failed to fetch" },
    }
  }

  redirect("/")
}

export default function SignUp() {
  return (
    <Page centered>
      <SignUpForm signUpAction={signUpAction} />
    </Page>
  )
}

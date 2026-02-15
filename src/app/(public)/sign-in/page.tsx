import {
  SignInForm,
  type SignInFormState,
} from "@/components/forms/auth/SignInForm"
import { SignInSchema } from "@/components/forms/auth/SignInSchema"
import { Page } from "@/components/layout/Page"
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

  redirect("/")
}

export default function SignIn() {
  return (
    <Page centered>
      <SignInForm signInAction={signInAction} />
    </Page>
  )
}

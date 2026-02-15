import {
  SignUpForm,
  type SignUpFormState,
} from "@/components/forms/auth/SignUpForm"
import { SignUpFormSchema } from "@/components/forms/auth/SignUpFormSchema"
import { Page } from "@/components/layout/Page"
import { redirect } from "next/navigation"
import z from "zod"

async function signUpAction(
  _formState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  "use server"

  const parsed = SignUpFormSchema.safeParse(Object.fromEntries(formData))

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

  redirect("/")
}

export default function SignUp() {
  return (
    <Page centered>
      <SignUpForm signUpAction={signUpAction} />
    </Page>
  )
}

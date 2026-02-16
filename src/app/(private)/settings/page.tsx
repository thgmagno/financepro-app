import { getDashboard } from "@/actions/dashboard"
import { ChangeUserPasswordForm } from "@/components/forms/user/ChangeUserPasswordForm"
import { UpdateUserProfileForm } from "@/components/forms/user/UpdateUserProfileForm"
import { Page } from "@/components/layout/Page"

export default async function Settings() {
  const { data } = await getDashboard()

  return (
    <Page>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <UpdateUserProfileForm />
      <ChangeUserPasswordForm />
    </Page>
  )
}

import { getDashboard } from "@/actions/dashboard"
import { CreateGroupForm } from "@/components/forms/group/CreateGroupForm"
import { Page } from "@/components/layout/Page"
import { GroupDetails } from "./GroupView"

export default async function Group() {
  const { data } = await getDashboard()

  return (
    <Page>
      {data.group ? (
        <GroupDetails group={data.group} currentUserEmail={data.email} />
      ) : (
        <CreateGroupForm />
      )}
    </Page>
  )
}

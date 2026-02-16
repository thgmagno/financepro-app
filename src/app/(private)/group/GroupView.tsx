"use client"

import {
  UpdateGroupForm,
  type UpdateGroupFormState,
} from "@/components/forms/group/UpdateGroupForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Group as GroupType } from "@/types"
import { Crown, LogOut } from "lucide-react"

interface GroupDetailsProps {
  currentUserEmail: string
  group: GroupType
  updateGroupAction(
    formState: UpdateGroupFormState,
    formData: FormData,
  ): Promise<UpdateGroupFormState>
}

export function GroupDetails({
  group,
  currentUserEmail,
  updateGroupAction,
}: GroupDetailsProps) {
  return (
    <Card className="w-full max-w-xl py-6">
      <GroupHeader
        groupName={group.name}
        isAdmin={group.isAdmin}
        updateGroupAction={updateGroupAction}
      />
      <CardContent className="px-4">
        {group.members.map((m) => (
          <div key={m.id} className="flex border rounded-md p-3 items-center">
            <div className="flex-1">
              <p className="flex gap-2 items-center">
                {m.name} {m.isAdmin && <Crown size={16} />}
              </p>
              <span className="text-muted-foreground text-sm">{m.email}</span>
            </div>
            {group.isAdmin && currentUserEmail !== m.email && (
              <Button variant="destructive" size="icon-sm">
                <LogOut />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface GroupHeaderProps {
  groupName: string
  isAdmin: boolean
  updateGroupAction(
    formState: UpdateGroupFormState,
    formData: FormData,
  ): Promise<UpdateGroupFormState>
}

function GroupHeader({
  groupName,
  isAdmin,
  updateGroupAction,
}: GroupHeaderProps) {
  if (isAdmin) {
    return (
      <UpdateGroupForm
        groupName={groupName}
        updateGroupAction={updateGroupAction}
      />
    )
  }

  return (
    <CardHeader>
      <CardTitle>Group: {groupName}</CardTitle>
    </CardHeader>
  )
}

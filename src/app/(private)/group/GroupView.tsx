"use client"

import { UpdateGroupForm } from "@/components/forms/group/UpdateGroupForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Group as GroupType } from "@/types"
import { Crown, LogOut } from "lucide-react"

interface GroupDetailsProps {
  currentUserEmail: string
  group: GroupType
}

export function GroupDetails({ group, currentUserEmail }: GroupDetailsProps) {
  return (
    <Card className="w-full max-w-xl py-6">
      <GroupHeader groupName={group.name} isAdmin={group.isAdmin} />
      <CardContent className="px-4">
        {group.members
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((m) => (
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
}

function GroupHeader({ groupName, isAdmin }: GroupHeaderProps) {
  if (isAdmin) {
    return <UpdateGroupForm groupName={groupName} />
  }

  return (
    <CardHeader>
      <CardTitle>Group: {groupName}</CardTitle>
    </CardHeader>
  )
}

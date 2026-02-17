import { Users } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"

interface DashboardHeaderProps {
  name: string
  email: string
  groupName?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function DashboardHeader({
  name,
  email,
  groupName,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-start gap-4 p-2">
      <Avatar className="size-11">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-0.5 flex-1">
        <h1 className="truncate text-lg font-semibold text-foreground leading-tight">
          {name}
        </h1>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>
      {groupName && (
        <Link href="/group">
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full px-3 py-1 text-xs"
          >
            <Users className="size-3" />
            {groupName}
          </Badge>
        </Link>
      )}
    </div>
  )
}

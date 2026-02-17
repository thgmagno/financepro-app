"use client"

import { endSession } from "@/actions/session"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  BanknoteArrowUp,
  ChartPie,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <Link href="/">
                    <ChartPie />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <Link href="/group">
                    <Users />
                    <span>Group</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <Link href="/transactions">
                    <BanknoteArrowUp />
                    <span>Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings"
                    onClick={() => {
                      if (isMobile) setOpenMobile(false)
                    }}
                  >
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LogOut />
                      <span>Log out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Log out of your account?</DialogTitle>
                    <DialogDescription>
                      You’ll be signed out on this device. To access your
                      account again, you’ll need to log in.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </DialogClose>

                    <form action={endSession}>
                      <Button type="submit" variant="destructive">
                        Log out
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

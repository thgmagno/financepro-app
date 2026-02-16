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
import { ChartPie, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import {
  Dialog,
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
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>End session</DialogTitle>
                    <DialogDescription>
                      You will need to authenticate again when you return.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <form action={endSession}>
                      <Button type="submit">Confirm</Button>
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

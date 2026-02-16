import { AppSidebar } from "@/components/layout/AppSidebar"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { config } from "@/config"
import { Plus } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"

async function getSidebarState() {
  "use server"
  const cookieStore = await cookies()
  return cookieStore.get(config.sidebarStateTokenName)?.value === "true"
}

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sidebarState = await getSidebarState()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      sidebarCookieName={config.sidebarStateTokenName}
      defaultOpen={sidebarState}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div className="ml-auto flex items-center gap-2">
              <form action="">
                <Link
                  href="/transactions/new"
                  className={buttonVariants({ size: "xs" })}
                >
                  New
                  <Plus />
                </Link>
              </form>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

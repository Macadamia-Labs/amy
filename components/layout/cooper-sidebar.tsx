import { NavSettings } from '@/components/layout/nav-settings'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar'
import { BrainCircuitIcon } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { NavDocs } from './nav-docs'

export function CooperSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link href="/">
            <div
              className={`flex aspect-square size-8 items-center justify-center rounded-sm bg-purple-500 text-white`}
            >
              <BrainCircuitIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Amy</span>
              <span className="truncate text-xs">by Macadamia Labs</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <NavDocs />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavSettings />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

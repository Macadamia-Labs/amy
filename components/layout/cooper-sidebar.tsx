import { NavSettings } from '@/components/layout/nav-settings'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import * as React from 'react'
import { ProjectSwitcher } from './app-switcher'
import { NavHome } from './nav-home'
import { NavIssues } from './nav-issues'
import { NavProjects } from './nav-projects'
import { NavResources } from './nav-resources'

export function CooperSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects />
        <SidebarGroup className="space-y-2">
          <NavHome />
          <NavIssues />
          <NavResources />
          {/* <NavDocs /> */}
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

import { NavSettings } from '@/components/layout/nav-settings'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import * as React from 'react'
import { ProjectSwitcher } from './app-switcher'
import { NavActivity } from './nav-activity'
import { NavHome } from './nav-home'
import { NavIssues } from './nav-issues'
import { NavResources } from './nav-resources'
import { SearchForm } from './search-form'

export default function CooperSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavProjects /> */}
        <SidebarGroup>
          <SearchForm />
        </SidebarGroup>

        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <NavHome />
          <NavIssues />
          <NavResources />
          <NavActivity />
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

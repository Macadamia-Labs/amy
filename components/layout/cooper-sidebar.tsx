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
import { MacadamiaHead } from './macadamia-head'
import { NavActivity } from './nav-activity'
import { NavHome } from './nav-home'
import { NavIntegrations } from './nav-integrations'
import { NavIssues } from './nav-issues'
import { NavProjects } from './nav-projects'
import { NavResources } from './nav-resources'
import { SearchForm } from './search-form'

export default function CooperSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <MacadamiaHead />
        {/* <ProjectSwitcher /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SearchForm />
        </SidebarGroup>
        <NavProjects />

        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <NavHome />
          <NavIssues />
          <NavResources />
          <NavIntegrations />
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

import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { getProjects } from '@/lib/actions/projects'
import * as React from 'react'
import { MacadamiaHead } from './macadamia-head'
import { NavHome } from './nav-home'
import { NavIntegrations } from './nav-integrations'
import { NavIssues } from './nav-issues'
import { NavResources } from './nav-resources'
import { NavWorkflows } from './nav-workflows'
import { SearchForm } from './search-form'

export default async function CooperSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { projects } = await getProjects()

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
        {/* <NavProjects projects={projects || []} /> */}

        <SidebarGroup className="space-y-2">
          {/* <SidebarGroupLabel>Project</SidebarGroupLabel> */}
          <NavHome />
          <NavIssues />
          <NavResources />
          <NavIntegrations />
          {/* <NavActivity /> */}
          <NavWorkflows />
          {/* <NavDocs /> */}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <NavSettings /> */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

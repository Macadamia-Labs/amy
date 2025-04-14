import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { fetchWorkflows } from '@/lib/actions/workflows'
import * as React from 'react'
import { MacadamiaHead } from './macadamia-head'
import { NavWorkflows } from './nav-actions'
import { NavHome } from './nav-home'
import { NavResources } from './nav-resources'
import { SearchForm } from './search-form'

export default async function CooperSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  // const { projects } = await getProjects()
  const workflows = await fetchWorkflows()

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
          {/* <SidebarGroupLabel>General</SidebarGroupLabel> */}
          <NavHome />
          <NavResources />
          {/* <NavIssues /> */}
          {/* <NavIntegrations /> */}
          {/* <NavActivity /> */}
          {/* <NavWorkflows /> */}
          {/* <NavDocs /> */}
        </SidebarGroup>
        <NavWorkflows workflows={workflows} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavSettings /> */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

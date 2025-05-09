'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { CreateWorkflowDialog } from '@/components/workflows/create-workflow-dialog'
import { WorkflowMenuItem } from '@/components/workflows/workflow-menu-item'
import { Workflow } from '@/lib/types/workflow'
import { useRouter } from 'next/navigation'

const defaultWorkflows: Workflow[] = [
  {
    id: 'check-bom',
    title: 'Check error bill of materials in drawings',
    description:
      'Verify and validate bill of materials in engineering drawings',
    icon: '📋',
    instructions: 'Check the bill of materials for errors',
    status: 'active'
  },
  {
    id: 'code-compliance-check',
    title: 'Code compliance check',
    description: 'Check code compliance of a project',
    icon: '📂',
    instructions: 'Check the code compliance of a project',
    status: 'active'
  }
]

export function NavWorkflows({
  workflows = defaultWorkflows
}: {
  workflows?: Workflow[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)

  const displayWorkflows = showAll ? workflows : workflows.slice(0, 3)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Workflows</SidebarGroupLabel>
        <CreateWorkflowDialog />
      </div>
      <SidebarMenu>
        <WorkflowMenuItem
          workflow={{
            id: 'error-checks',
            title: 'Error checks',
            description: 'Check for errors in engineering drawings',
            instructions: 'Check the bill of materials for errors',
            status: 'active'
          }}
        />
        {displayWorkflows.map(workflow => (
          <WorkflowMenuItem key={workflow.id} workflow={workflow} />
        ))}
        {workflows.length > 3 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="text-sidebar-foreground/70" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="text-sidebar-foreground/70" />
                  <span>Show More</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

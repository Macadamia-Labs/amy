'use client'

import { MoreHorizontalIcon } from '@/lib/utils/icons'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { CreateWorkflowDialog } from '@/components/workflows/create-workflow-dialog'
import { useRouter } from 'next/navigation'

interface Workflow {
  id: string
  name: string
  description: string
  icon: string
}

const workflows: Workflow[] = [
  {
    id: 'check-bom',
    name: 'Check error bill of materials in drawings',
    description:
      'Verify and validate bill of materials in engineering drawings',
    icon: '📋'
  },
  {
    id: 'code-compliance-check',
    name: 'Code compliance check',
    description: 'Check code compliance of a project',
    icon: '📂'
  }
]

export function NavWorkflows() {
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
        {displayWorkflows.map(workflow => (
          <SidebarMenuItem key={workflow.id}>
            <SidebarMenuButton
              onClick={() => {
                router.push(`/workflows/${workflow.id}`)
              }}
            >
              <span className="text-lg">{workflow.icon}</span>
              <span>{workflow.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <span className="text-sm text-muted-foreground">
                    {workflow.description}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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

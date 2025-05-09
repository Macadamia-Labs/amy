'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { EditWorkflowDialog } from '@/components/workflows/edit-workflow-dialog'
import { deleteWorkflow } from '@/lib/actions/workflows'
import { Workflow } from '@/lib/types/workflow'
import {
  LightningIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon
} from '@/lib/utils/icons'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface WorkflowMenuItemProps {
  workflow: Workflow
}

export function WorkflowMenuItem({ workflow }: WorkflowMenuItemProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  return (
    <SidebarMenuItem key={workflow.id}>
      <SidebarMenuButton
        onClick={() => {
          router.push(`/workflows/${workflow.id}`)
        }}
      >
        <span className="text-lg">
          {workflow.icon || <LightningIcon className="size-4" />}{' '}
        </span>
        <span>{workflow.title || 'Untitled'}</span>
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
          <DropdownMenuSeparator />
          <EditWorkflowDialog
            workflow={workflow}
            trigger={
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <PencilIcon className="text-muted-foreground size-4 mr-2" />
                <span>Rename</span>
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem
            onClick={async () => {
              try {
                await deleteWorkflow(workflow.id)
                toast.success('Workflow deleted successfully')
                router.refresh()
              } catch (error) {
                toast.error('Failed to delete workflow')
              }
            }}
            className="text-destructive"
          >
            <TrashIcon className="text-destructive size-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

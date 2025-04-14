import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { EditWorkflowDialog } from '@/components/workflows/edit-workflow-dialog'
import { Workflow } from '@/lib/types/workflow'

interface WorkflowHeaderProps {
  workflow: Workflow
}

export default async function WorkflowHeader({
  workflow
}: WorkflowHeaderProps) {
  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workflows">Workflows </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-primary">
            {workflow.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        {workflow && <EditWorkflowDialog workflow={workflow} />}
      </div>
    </header>
  )
}

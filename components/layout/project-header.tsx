import { EditProjectDialog } from '@/components/projects/edit-project-dialog'
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getProject } from '@/lib/actions/projects'

interface ProjectHeaderProps {
  projectId: string
}

export default async function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const { project } = await getProject(projectId)

  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbItem>{project?.name}</BreadcrumbItem>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        {project && <EditProjectDialog project={project} />}
      </div>
    </header>
  )
}

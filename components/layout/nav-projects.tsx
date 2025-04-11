'use client'

import { MoreHorizontalIcon, PencilIcon, TrashIcon } from '@/lib/utils/icons'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { EditProjectDialog } from '@/components/projects/edit-project-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { deleteProject } from '@/lib/actions/projects'
import { Project } from '@/lib/types/database'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function NavProjects({
  projects = [],
  defaultColor = 'blue'
}: {
  projects: (Project & { color?: string })[]
  defaultColor?: string
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)

  // Sort projects by creation time (most recent first) and get the display list
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const displayProjects = showAll ? sortedProjects : sortedProjects.slice(0, 3)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <CreateProjectDialog />
      </div>
      <SidebarMenu>
        {displayProjects.map(item => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              onClick={e => {
                e.preventDefault()
                if (item.id) {
                  router.push(`/projects/${item.id}`)
                }
              }}
            >
              <div
                className={`size-2 rounded-full opacity-80 bg-${
                  item.color || defaultColor
                }-500`}
              />
              <span>{item.name}</span>
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
                <EditProjectDialog
                  project={item}
                  trigger={
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <PencilIcon className="text-muted-foreground size-4 mr-2" />
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    if (!item.id) return
                    const result = await deleteProject(item.id)
                    if (result.error) {
                      toast.error(result.error)
                    } else {
                      toast.success('Project deleted successfully')
                      router.refresh()
                    }
                  }}
                  className="text-destructive"
                >
                  <TrashIcon className="text-destructive size-4 mr-2" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {projects.length > 3 && (
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

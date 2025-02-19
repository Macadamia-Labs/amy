'use client'

import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { BoxIcon } from '@/lib/utils/icons'

// This would typically come from an API or database
const projects = [
  {
    name: 'My First Project',
    description: 'Engineering simulation project',
    icon: BoxIcon,
    path: '/projects/first-project',
    bgColor: 'bg-sky-500'
  },
  {
    name: 'Optimization Study',
    description: 'Parameter optimization',
    icon: BoxIcon,
    path: '/projects/optimization',
    bgColor: 'bg-emerald-500'
  }
]

export function ProjectSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedProject, setSelectedProject] = React.useState(() => {
    return (
      projects.find(project => pathname.startsWith(project.path)) || projects[0]
    )
  })

  React.useEffect(() => {
    const matchingProject = projects.find(project =>
      pathname.startsWith(project.path)
    )
    if (matchingProject && matchingProject.name !== selectedProject.name) {
      setSelectedProject(matchingProject)
    }
  }, [pathname, selectedProject.name])

  const handleProjectSwitch = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    if (!pathname.startsWith(project.path)) {
      router.push(project.path)
    }
  }

  const handleNewProject = () => {
    router.push('/projects/new')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-sm ${selectedProject.bgColor} text-white`}
              >
                <selectedProject.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedProject.name}
                </span>
                <span className="truncate text-xs">
                  {selectedProject.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" align="start">
            {projects.map(project => (
              <DropdownMenuItem
                key={project.name}
                onSelect={() => handleProjectSwitch(project)}
              >
                <div className="flex items-center gap-4 pr-1 w-full">
                  <div
                    className={`flex aspect-square size-6 items-center justify-center rounded-sm ${project.bgColor} text-white`}
                  >
                    <project.icon className="size-3" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold">{project.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.description}
                    </span>
                  </div>
                  {project.name === selectedProject.name && (
                    <Check className="ml-auto size-4" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleNewProject}>
              <div className="flex items-center gap-4 pr-1 w-full">
                <div className="flex aspect-square size-6 items-center justify-center rounded-sm bg-muted text-muted-foreground">
                  <Plus className="size-3" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">New Project</span>
                  <span className="text-xs text-muted-foreground">
                    Create a new project
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

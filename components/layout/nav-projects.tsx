'use client'

import {
  ChevronDown,
  ChevronUp,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

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
import { Project } from '@/lib/types/database'
import { useRouter } from 'next/navigation'

// Example hardcoded projects for development
const exampleProjects: (Project & { color: string })[] = [
  {
    id: '1',
    name: 'Industrial Storage Tank for Water',
    description: 'CFD simulation of wind turbine performance',
    user_id: 'user1',
    app: 'simulation',
    created_at: new Date(2024, 2, 15).toISOString(),
    updated_at: new Date(2024, 2, 15).toISOString(),
    simulations: [],
    color: 'bg-purple-500'
  },
  {
    id: '2',
    name: 'Solar Panel Optimization',
    description: 'Thermal analysis of solar panel configurations',
    user_id: 'user1',
    app: 'simulation',
    created_at: new Date(2024, 2, 10).toISOString(),
    updated_at: new Date(2024, 2, 10).toISOString(),
    simulations: [],
    color: 'bg-amber-500'
  },
  {
    id: '3',
    name: 'Battery Cooling System',
    description: 'Heat transfer simulation for EV batteries',
    user_id: 'user1',
    app: 'simulation',
    created_at: new Date(2024, 2, 5).toISOString(),
    updated_at: new Date(2024, 2, 5).toISOString(),
    simulations: [],
    color: 'bg-blue-500'
  },
  {
    id: '4',
    name: 'Bridge Structure Analysis',
    description: 'Structural simulation of bridge design',
    user_id: 'user1',
    app: 'simulation',
    created_at: new Date(2024, 2, 1).toISOString(),
    updated_at: new Date(2024, 2, 1).toISOString(),
    simulations: [],
    color: 'bg-purple-500'
  }
]

export function NavProjects({
  projects: providedProjects = [],
  defaultColor = 'bg-blue-500'
}: {
  projects?: (Project & { color?: string })[]
  defaultColor?: string
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)

  // Use example projects if no projects are provided
  const projects =
    providedProjects.length > 0 ? providedProjects : exampleProjects

  // Sort projects by creation time (most recent first) and get the display list
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const displayProjects = showAll ? sortedProjects : sortedProjects.slice(0, 3)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {displayProjects.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              onClick={e => {
                e.preventDefault()
                if (item.id) {
                  router.push(`/projects/${item.id}`)
                }
              }}
            >
              <div
                className={`size-2 rounded-full opacity-80 ${
                  item.color || defaultColor
                }`}
              />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
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

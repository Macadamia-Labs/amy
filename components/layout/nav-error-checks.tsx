'use client'

import { useRouter } from 'next/navigation'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { ClockIcon, PlayCircleIcon, RulerIcon } from '@/lib/utils/icons'

export function NavErrorChecks() {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleRunErrorChecks = () => {
    console.log('Navigate to Run Error Checks')
  }

  const handleRules = () => {
    console.log('Navigate to Rules')
  }

  const handleAllRuns = () => {
    console.log('Navigate to All Runs')
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Error Checks</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleRunErrorChecks}>
            <span className="flex items-center gap-2">
              <PlayCircleIcon className="size-4" />
              Run Error Checks
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleRules}>
            <span className="flex items-center gap-2">
              <RulerIcon className="size-4" />
              Rules
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleAllRuns}>
            <span className="flex items-center gap-2">
              <ClockIcon className="size-4" />
              All Runs
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

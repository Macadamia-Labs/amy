'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { WorkflowIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavWorkflows() {
  const pathname = usePathname()
  const isActive = pathname === '/workflows'

  return (
    <Link href="/workflows">
      <SidebarMenuButton tooltip="Workflows" isActive={isActive}>
        <WorkflowIcon className="size-6" />
        Workflows
      </SidebarMenuButton>
    </Link>
  )
}

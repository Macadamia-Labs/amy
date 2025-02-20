'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { BoxIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavResources() {
  const pathname = usePathname()
  const isActive = pathname === '/resources'

  return (
    <Link href="/resources">
      <SidebarMenuButton tooltip="Resources" isActive={isActive}>
        <BoxIcon className="size-6" />
        Resources
      </SidebarMenuButton>
    </Link>
  )
}

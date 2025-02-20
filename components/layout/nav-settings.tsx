'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { GearIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavSettings() {
  const pathname = usePathname()
  const isActive = pathname === '/settings'

  return (
    <Link href="/settings">
      <SidebarMenuButton tooltip="Settings" isActive={isActive}>
        <GearIcon />
        Settings
      </SidebarMenuButton>
    </Link>
  )
}

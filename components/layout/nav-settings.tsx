import { SidebarMenuButton } from '@/components/ui/sidebar'
import { GearIcon } from '@/lib/utils/icons'
import Link from 'next/link'

export function NavSettings() {
  return (
    <Link href="/settings">
      <SidebarMenuButton>
        <GearIcon />
        Settings
      </SidebarMenuButton>
    </Link>
  )
}

import { SidebarMenuButton } from '@/components/ui/sidebar'
import { HomeIcon } from '@/lib/utils/icons'
import Link from 'next/link'

export function NavHome() {
  return (
    <Link href="/">
      <SidebarMenuButton tooltip="Home">
        <HomeIcon className="size-6" />
        Home
      </SidebarMenuButton>
    </Link>
  )
}

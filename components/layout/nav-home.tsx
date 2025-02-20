'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { HomeIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavHome() {
  const pathname = usePathname()
  const isActive = pathname === '/'

  return (
    <Link href="/">
      <SidebarMenuButton tooltip="Home" isActive={isActive}>
        <HomeIcon className="size-6" />
        Home
      </SidebarMenuButton>
    </Link>
  )
}

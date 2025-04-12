'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { ChatIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavHome() {
  const pathname = usePathname()
  const isActive = pathname === '/'

  return (
    <Link href="/">
      <SidebarMenuButton tooltip="Home" isActive={isActive}>
        <ChatIcon className="size-6" />
        Chat
      </SidebarMenuButton>
    </Link>
  )
}

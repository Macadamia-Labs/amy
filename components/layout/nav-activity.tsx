'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { ActivityIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavActivity() {
  const pathname = usePathname()
  const isActive = pathname === '/activity'

  return (
    <Link href="/activity">
      <SidebarMenuButton tooltip="Activity" isActive={isActive}>
        <ActivityIcon className="size-6" />
        Activity
      </SidebarMenuButton>
    </Link>
  )
}

'use client'
import { SidebarMenuBadge, SidebarMenuButton } from '@/components/ui/sidebar'
import { FireIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavIssuesProps {
  number?: number
}

export function NavIssues({ number }: NavIssuesProps) {
  const pathname = usePathname()
  const isActive = pathname === '/issues'

  return (
    <Link href="/issues">
      <SidebarMenuButton tooltip="Issues" isActive={isActive}>
        <FireIcon className="size-6" />
        Issues
        {typeof number === 'number' && (
          <SidebarMenuBadge>{number}</SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    </Link>
  )
}

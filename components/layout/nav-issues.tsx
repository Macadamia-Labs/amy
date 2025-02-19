import { SidebarMenuBadge, SidebarMenuButton } from '@/components/ui/sidebar'
import { FireIcon } from '@/lib/utils/icons'
import Link from 'next/link'

interface NavIssuesProps {
  number?: number
}

export function NavIssues({ number }: NavIssuesProps) {
  return (
    <Link href="/issues">
      <SidebarMenuButton tooltip="Issues">
        <FireIcon className="size-6" />
        Issues
        {typeof number === 'number' && (
          <SidebarMenuBadge>{number}</SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    </Link>
  )
}

import { SidebarMenuButton } from '@/components/ui/sidebar'
import { FireIcon } from '@/lib/utils/icons'
import Link from 'next/link'

export function NavIssues() {
  return (
    <Link href="/issues">
      <SidebarMenuButton>
        <FireIcon className="size-6" />
        Issues
      </SidebarMenuButton>
    </Link>
  )
}

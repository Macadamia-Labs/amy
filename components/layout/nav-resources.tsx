import { SidebarMenuButton } from '@/components/ui/sidebar'
import { BoxIcon } from '@/lib/utils/icons'
import Link from 'next/link'

export function NavResources() {
  return (
    <Link href="/resources">
      <SidebarMenuButton>
        <BoxIcon className="size-6" />
        Resources
      </SidebarMenuButton>
    </Link>
  )
}

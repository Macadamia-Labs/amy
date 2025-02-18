import { SidebarMenuButton } from '@/components/ui/sidebar'
import { TextFileIcon } from '@/lib/utils/icons'
import Link from 'next/link'

export function NavDocs() {
  return (
    <Link href="/docs">
      <SidebarMenuButton>
        <TextFileIcon />
        Docs
      </SidebarMenuButton>
    </Link>
  )
}

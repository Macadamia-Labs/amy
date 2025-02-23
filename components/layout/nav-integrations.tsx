'use client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { IntegrationIcon } from '@/lib/utils/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavIntegrations() {
  const pathname = usePathname()
  const isActive = pathname === '/integrations'

  return (
    <Link href="/integrations">
      <SidebarMenuButton tooltip="Integrations" isActive={isActive}>
        <IntegrationIcon className="size-6" />
        Integrations
      </SidebarMenuButton>
    </Link>
  )
}

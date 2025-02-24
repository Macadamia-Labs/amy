import Image from 'next/image'
import { SidebarMenuButton } from '../ui/sidebar'

export function MacadamiaHead() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Image
        src="/images/macadamia.png"
        alt="Macadamia"
        width={32}
        height={32}
        className="rounded border"
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Macadamia</span>
        <span className="truncate text-xs">AI Engineering Platform</span>
      </div>
    </SidebarMenuButton>
  )
}

import { CooperSidebar } from '@/components/layout/cooper-sidebar'
import Header from '@/components/layout/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <CooperSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen pr-2">
          <Header />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

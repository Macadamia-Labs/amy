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
      <div className="flex h-screen w-screen">
        <CooperSidebar />
        <SidebarInset>
          <div className="flex flex-col h-full">
            <Header />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

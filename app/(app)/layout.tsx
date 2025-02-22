import CooperSidebar from '@/components/layout/cooper-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-screen">
        <CooperSidebar />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}

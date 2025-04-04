import { ActivityProvider } from '@/components/changes/activity-provider'
import CooperSidebar from '@/components/layout/cooper-sidebar'
import { ResourcesProvider } from '@/components/providers/resources-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getResources } from '@/lib/actions/resources'

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const resources = await getResources()

  return (
    <SidebarProvider defaultOpen={true}>
      <ActivityProvider>
        <ResourcesProvider initialResources={resources}>
          <div className="flex h-screen w-screen">
            <CooperSidebar />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </ResourcesProvider>
      </ActivityProvider>
    </SidebarProvider>
  )
}

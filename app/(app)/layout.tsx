import { ActivityProvider } from '@/components/changes/activity-provider'
import CooperSidebar from '@/components/layout/cooper-sidebar'
import { ResourcesProvider } from '@/components/providers/resources-provider'
import { RulesProvider } from '@/components/providers/rules-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getResources } from '@/lib/actions/resources'
import { getRules } from '@/lib/actions/rules'

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const resources = await getResources()
  const rules = await getRules()

  return (
    <SidebarProvider defaultOpen={true}>
      <ActivityProvider>
        <RulesProvider initialRules={rules}>
          <ResourcesProvider initialResources={resources}>
            <div className="flex h-screen w-screen">
              <CooperSidebar />
              <SidebarInset>{children}</SidebarInset>
            </div>
          </ResourcesProvider>
        </RulesProvider>
      </ActivityProvider>
    </SidebarProvider>
  )
}

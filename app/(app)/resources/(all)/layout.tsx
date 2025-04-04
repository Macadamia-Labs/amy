import ResourcesHeader from '@/components/layout/resources-header'
import { ResourcesProvider } from '@/components/providers/resources-provider'
import { getResources } from '@/lib/actions/resources'

export default async function ResourcesLayout({
  children
}: {
  children: React.ReactNode
}) {
  const resources = await getResources()

  return (
    <ResourcesProvider initialResources={resources}>
      <div className="flex flex-col h-full">
        <ResourcesHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ResourcesProvider>
  )
}

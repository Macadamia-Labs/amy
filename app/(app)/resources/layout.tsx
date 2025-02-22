import ResourcesHeader from '@/components/layout/resources-header'
import { ResourcesProvider } from '@/components/providers/resources-provider'
import { ChatsProvider } from '@/lib/providers/chats-provider'
import { getResources } from '@/lib/queries/server'
export default async function ResourcesLayout({
  children
}: {
  children: React.ReactNode
}) {
  const resources = await getResources()

  return (
    <ResourcesProvider initialResources={resources}>
      <ChatsProvider>
        <ResourcesHeader />
        {children}
      </ChatsProvider>
    </ResourcesProvider>
  )
}

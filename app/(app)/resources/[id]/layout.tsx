import ResourceHeader from '@/components/layout/resource-header'
import { ChatsProvider } from '@/lib/providers/chats-provider'
import { DocumentProvider } from '@/lib/providers/document-provider'
import { getResourceEnriched } from '@/lib/queries/server'

export default async function ResourceLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  const resource = await getResourceEnriched(id)
  const content = resource.content || 'No Content in Resource'

  return (
    <DocumentProvider initialContent={content} resource={resource}>
      <ChatsProvider>
        <div className="flex flex-col h-full">
          <ResourceHeader resource={resource} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </ChatsProvider>
    </DocumentProvider>
  )
}

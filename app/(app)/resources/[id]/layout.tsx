import ResourceHeader from '@/components/layout/resource-header'
import { defaultResources } from '@/data/resources'
import { getResourceEnriched } from '@/lib/actions/resources'
import { ChatsProvider } from '@/lib/providers/chats-provider'
import { DocumentProvider } from '@/lib/providers/document-provider'
import { Resource } from '@/lib/types'
import { Resource as DatabaseResource } from '@/lib/types/database'
import { isUUID } from '@/lib/utils'
import { notFound } from 'next/navigation'

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
  let resource: (Resource | DatabaseResource) | null = null

  if (!isUUID(id)) {
    resource = defaultResources.find(r => r.id === id) || null
  } else {
    resource = await getResourceEnriched(id)
  }

  if (!resource) {
    notFound()
  }

  // For database resources, content comes from embeddings or the content field
  // For local resources, content might be directly available
  const content =
    'content_as_text' in resource && resource.content_as_text
      ? resource.content_as_text
      : 'content' in resource && resource.content.pages
      ? resource.content.pages.map(page => page.markdown).join('\n')
      : 'embeddings' in resource && resource.embeddings
      ? resource.embeddings.map(embedding => embedding.content).join('\n')
      : 'No Content in Resource'

  console.log('[ResourceLayout] Resource:', resource)

  return (
    <DocumentProvider initialContent={content} resource={resource as any}>
      <ChatsProvider>
        <div className="flex flex-col h-full">
          <ResourceHeader resource={resource as any} />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </ChatsProvider>
    </DocumentProvider>
  )
}

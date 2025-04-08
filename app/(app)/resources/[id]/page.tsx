import { DocsLayout } from '@/components/layout/docs-layout'
import ResourceHeader from '@/components/layout/resource-header'
import { defaultResources } from '@/data/resources'
import { getResourceEnriched } from '@/lib/actions/resources'
import { ChatsProvider } from '@/lib/providers/chats-provider'
import { DocumentProvider } from '@/lib/providers/document-provider'
import { Resource } from '@/lib/types'
import { Resource as DatabaseResource } from '@/lib/types/database'
import { isUUID } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ResourceLoading from './loading'

export default async function ResourcePage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  let resource: (Resource | DatabaseResource) | null = null

  if (!isUUID(id)) {
    resource = defaultResources.find(r => r.id === id) || null
  } else {
    resource = await getResourceEnriched(id)
  }

  if (!resource) {
    notFound()
  }

  const content =
    'content_as_text' in resource && resource.content_as_text
      ? resource.content_as_text
      : 'content' in resource &&
        resource.content &&
        typeof resource.content !== 'string' &&
        'pages' in resource.content
      ? (resource.content as { pages: { markdown: string }[] }).pages
          .map(page => page.markdown)
          .join('\n')
      : 'embeddings' in resource && resource.embeddings
      ? resource.embeddings.map(embedding => embedding.content).join('\n')
      : 'No Content in Resource'

  return (
    <DocumentProvider initialContent={content} resource={resource as any}>
      <ChatsProvider>
        <ResourceHeader resource={resource as any} />
        <Suspense fallback={<ResourceLoading />}>
          <div className="flex-1 overflow-auto">
            <DocsLayout />
          </div>
        </Suspense>
      </ChatsProvider>
    </DocumentProvider>
  )
}

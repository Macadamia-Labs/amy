import { ResourcesProvider } from '@/components/providers/resources-provider'
import { ResourcesTable } from '@/components/resources/resources-table'
import { UploadDialog } from '@/components/resources/upload-dialog'
import { getResources } from '@/lib/queries/server'
import { Suspense } from 'react'

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="p-4 w-full overflow-auto">
      <ResourcesProvider initialResources={resources}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">All Resources</h2>
              <p className="text-muted-foreground">
                Access engineering documents, standards, and project
                communications
              </p>
            </div>

            <UploadDialog />
          </div>

          <Suspense fallback={<div>Loading resources...</div>}>
            <ResourcesTable />
          </Suspense>
        </div>
      </ResourcesProvider>
    </div>
  )
}

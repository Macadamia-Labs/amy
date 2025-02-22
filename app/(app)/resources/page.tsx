import { ResourcesTable } from '@/components/resources/resources-table'
import { Suspense } from 'react'

export default function ResourcesPage() {
  return (
    <div className="p-4 w-full overflow-auto">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">All Resources</h2>
          <p className="text-muted-foreground">
            Access engineering documents, standards, and project communications
          </p>
        </div>

        <Suspense fallback={<div>Loading resources...</div>}>
          <ResourcesTable />
        </Suspense>
      </div>
    </div>
  )
}

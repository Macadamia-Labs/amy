import { ResourcesTable } from '@/components/resources/resources-table'

export default async function ResourcesPage() {
  return (
    <div className="p-4 w-full overflow-auto">
      <ResourcesTable />
    </div>
  )
}

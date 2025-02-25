import { WorkflowsProvider } from '@/components/providers/workflows-provider'
import { WorkflowsTable } from '@/components/workflows/workflows-table'

export default function WorkflowsPage() {
  return (
    <WorkflowsProvider>
      <div className="container py-6">
        <WorkflowsTable />
      </div>
    </WorkflowsProvider>
  )
}

import WorkflowsHeader from '@/components/layout/workflows-header'
import { WorkflowsProvider } from '@/components/providers/workflows-provider'
import { GraphWorkflowsTable } from '@/components/workflows/workflows-table'

export default function WorkflowsPage() {
  return (
    <WorkflowsProvider>
      <div className="flex flex-col h-full">
        <WorkflowsHeader />
        <div className="flex-1 overflow-auto p-4">
          <GraphWorkflowsTable />
        </div>
      </div>
    </WorkflowsProvider>
  )
}

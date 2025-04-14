'use client'

import { BuildGrid } from '@/components/buildgrid/build-grid'
import { useWorkflows } from '@/components/providers/graph-workflows-provider'
import { ExecutionLog } from '@/components/ui/execution-log'
import { useParams } from 'next/navigation'

export default function WorkflowPage() {
  const params = useParams()
  const id = params.id as string
  const { workflows, executeWorkflow, runningWorkflows } = useWorkflows()

  const workflow = workflows.find(w => w.id === id)

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex-1">
        <BuildGrid workflowId={id} />
      </div>
      <ExecutionLog className="mt-auto" />
    </div>
  )
}

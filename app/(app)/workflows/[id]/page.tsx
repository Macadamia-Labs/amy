import { WorkflowChat } from '@/components/workflows/workflow-chat'
import { WorkflowResults } from '@/components/workflows/workflow-results'
import { fetchWorkflow } from '@/lib/actions/workflows'
import { notFound } from 'next/navigation'
import { InstructionsCard } from './instructions-card'
import { ResourcesCard } from './resources-card'

export default async function WorkflowPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const workflow = await fetchWorkflow(id)

  if (!workflow) {
    return notFound()
  }

  return (
    <div className="max-h-full flex flex-col p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{workflow.title}</h1>
        <p className="text-muted-foreground mt-1">{workflow.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2 space-y-6">
          <InstructionsCard
            workflowId={workflow.id}
            initialInstructions={workflow.instructions}
          />
          <WorkflowResults workflowId={workflow.id} />
          <WorkflowChat id={id} workflow={workflow} />
        </div>

        <div>
          <ResourcesCard
            workflowId={workflow.id}
            initialResourceIds={workflow.resourceIds || []}
          />
        </div>
      </div>
    </div>
  )
}

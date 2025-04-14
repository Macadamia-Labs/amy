import GraphWorkflowHeader from '@/components/layout/graph-workflow-header'
import { GraphWorkflowsProvider } from '@/components/providers/graph-workflows-provider'
import { getWorkflow } from '@/data'
import { notFound } from 'next/navigation'

export default async function WorkflowLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workflow = await getWorkflow(id)

  if (!workflow) {
    notFound()
  }

  return (
    <GraphWorkflowsProvider initialWorkflows={[workflow]}>
      <div className="flex flex-col h-full">
        <GraphWorkflowHeader workflow={workflow} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </GraphWorkflowsProvider>
  )
}

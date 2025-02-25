import WorkflowHeader from '@/components/layout/workflow-header'
import { WorkflowsProvider } from '@/components/providers/workflows-provider'
import { getWorkflow } from '@/data'
import { notFound } from 'next/navigation'

export default async function WorkflowLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const workflow = await getWorkflow(params.id)

  if (!workflow) {
    notFound()
  }

  return (
    <WorkflowsProvider initialWorkflows={[workflow]}>
      <div className="flex flex-col h-full">
        <WorkflowHeader workflow={workflow} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </WorkflowsProvider>
  )
}

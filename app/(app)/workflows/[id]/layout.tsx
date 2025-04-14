import { fetchWorkflow } from '@/lib/actions/workflows'
import WorkflowHeader from './workflow-header'

export default async function WorkflowsLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workflow = await fetchWorkflow(id)
  return (
    <div className="flex flex-col h-full">
      <WorkflowHeader workflow={workflow} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

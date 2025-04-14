import { WorkflowsProvider } from '@/components/providers/workflows-provider'
import { fetchWorkflows } from '@/lib/actions/workflows'

export default async function WorkflowsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const workflows = await fetchWorkflows()
  return <WorkflowsProvider workflows={workflows}>{children}</WorkflowsProvider>
}

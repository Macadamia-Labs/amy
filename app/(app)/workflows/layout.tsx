import { WorkflowsProvider } from '@/components/providers/workflows-provider'

export default function WorkflowsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <WorkflowsProvider>{children}</WorkflowsProvider>
}

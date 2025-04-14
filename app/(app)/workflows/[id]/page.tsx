import { Chat } from '@/components/chat'
import { notFound } from 'next/navigation'
import { InstructionsCard } from './instructions-card'
import { ResourcesCard } from './resources-card'

// Define the Workflow interface
interface Workflow {
  id: string
  name: string
  description: string
  icon: string
}

// Import the workflows data
const workflows: Workflow[] = [
  {
    id: 'check-bom',
    name: 'Check error bill of materials in drawings',
    description:
      'Verify and validate bill of materials in engineering drawings',
    icon: '📋'
  },
  {
    id: 'code-compliance-check',
    name: 'Code compliance check',
    description: 'Check code compliance of a project',
    icon: '📂'
  }
]

export default async function WorkflowPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Find the workflow with the matching ID from the workflows array
  const workflow = workflows.find(w => w.id === id)

  if (!workflow) {
    return notFound()
  }

  return (
    <div className="max-h-full flex flex-col p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {workflow.icon} {workflow.name}
        </h1>

        <p className="text-muted-foreground mt-1">{workflow.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2 space-y-6">
          <InstructionsCard />
          <div>
            <Chat id={id} isWorkflow={true} />
          </div>
        </div>

        <div>
          <ResourcesCard />
        </div>
      </div>
    </div>
  )
}

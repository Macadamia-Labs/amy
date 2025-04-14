import { Chat } from '@/components/chat'
import { fetchWorkflow } from '@/lib/actions/workflows'
import { Workflow } from '@/lib/types/workflow'
import { notFound } from 'next/navigation'
import { InstructionsCard } from './instructions-card'
import { ResourcesCard } from './resources-card'

// Import the workflows data
const defaultWorkflows: Workflow[] = [
  {
    id: 'check-bom',
    title: 'Check error bill of materials in drawings',
    description:
      'Verify and validate bill of materials in engineering drawings',
    icon: '📋',
    instructions:
      '1. Open the drawing\n2. Check the BOM section\n3. Verify all components are listed\n4. Cross-reference with the parts list',
    resourceIds: []
  },
  {
    id: 'code-compliance-check',
    title: 'Code compliance check',
    description: 'Check code compliance of a project',
    icon: '📂',
    instructions:
      '1. Review applicable codes\n2. Check design against code requirements\n3. Document any non-compliance\n4. Suggest corrective actions',
    resourceIds: []
  }
]

export default async function WorkflowPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Check if the ID is a UUID (v4 format)
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    )

  let workflow: Workflow | null = null

  if (isUUID) {
    // Fetch from Supabase if it's a UUID
    workflow = await fetchWorkflow(id)
  } else {
    // Check hardcoded workflows if it's not a UUID
    workflow = defaultWorkflows.find(w => w.id === id) || null
  }

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
          <div>
            <Chat id={id} isWorkflow={true} />
          </div>
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

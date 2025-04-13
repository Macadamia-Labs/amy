import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { InstructionsCard } from './instructions-card'

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

  const handleInstructionsChange = (instructions: string) => {
    // Here you can handle the instructions change, e.g., save to database
    console.log('Instructions changed:', instructions)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {workflow.icon} {workflow.name}
        </h1>

        <p className="text-muted-foreground mt-1">{workflow.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <InstructionsCard onInstructionsChange={handleInstructionsChange} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attached Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>No execution history yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

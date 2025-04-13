import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, PlayCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

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
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {workflow.icon} {workflow.name}
        </h1>

        <p className="text-muted-foreground mt-1">{workflow.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>Configure and run this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This workflow can help you automate tasks related to
                  {workflow.name.toLowerCase().includes('bom')
                    ? ' bill of materials validation'
                    : ' code compliance checking'}
                  .
                </p>
                <Separator />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created on January 15, 2023</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last run 3 days ago</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <form action="/api/run-workflow" method="POST">
                <input type="hidden" name="workflowId" value={workflow.id} />
                <Button type="submit" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Run Workflow
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>Previous runs</CardDescription>
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

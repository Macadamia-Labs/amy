import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchWorkflows } from '@/lib/actions/workflows'
import Link from 'next/link'

export default async function WorkflowsPage() {
  const workflows = await fetchWorkflows()
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{'Workflows'}</h1>
        <p className="text-muted-foreground mt-1">
          {'A list of all your workflows.'}
        </p>
      </div>{' '}
      <ul className="space-y-4">
        {workflows.map(workflow => (
          <li key={workflow.id}>
            <Link href={`/workflows/${workflow.id}`}>
              <Card className="w-fit min-w-96">
                <CardHeader>
                  <CardTitle>{workflow.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { fetchWorkflows } from '@/lib/actions/workflows'

export default async function WorkflowsPage() {
  const workflows = await fetchWorkflows()
  return (
    <div>
      <h1>Workflows</h1>
      <ul>
        {workflows.map(workflow => (
          <li key={workflow.id}>{workflow.title}</li>
        ))}
      </ul>
    </div>
  )
}

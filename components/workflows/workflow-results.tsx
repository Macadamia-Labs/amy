'use client'

import { useWorkflows } from '@/components/providers/workflows-provider'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface WorkflowResultsProps {
  workflowId: string
  className?: string
}

export function WorkflowResults({
  workflowId,
  className
}: WorkflowResultsProps) {
  const { workflowResults, runningWorkflows } = useWorkflows()
  console.log('[WorkflowResults] workflowResults', workflowResults)
  const results = workflowResults[workflowId]
  const isLoading = runningWorkflows.has(workflowId)

  if (isLoading || !results) {
    return null
  }

  return (
    <Card className="w-full bg-lime-100 text-lime-800 rounded-3xl p-6">
      <ScrollArea className="max-h-[300px]">
        <pre className="whitespace-pre-wrap text-sm">{results}</pre>
      </ScrollArea>
    </Card>
  )
}

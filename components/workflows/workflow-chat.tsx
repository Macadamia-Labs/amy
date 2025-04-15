'use client'

import { Chat } from '@/components/chat'
import { useWorkflows } from '@/components/providers/workflows-provider'
import { Workflow } from '@/lib/types/workflow'

interface WorkflowChatProps {
  id: string
  workflow: Workflow
}

export function WorkflowChat({ id, workflow }: WorkflowChatProps) {
  const { workflowResults } = useWorkflows()
  const result = workflowResults[id] || null

  return (
    <div>
      <Chat
        id={id}
        isWorkflow={true}
        workflowContext={{
          ...workflow,
          result
        }}
      />
    </div>
  )
}

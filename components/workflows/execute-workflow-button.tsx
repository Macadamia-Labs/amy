'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { GraphWorkflowStatus } from '@/lib/types/workflow'
import { LightningIcon } from '@/lib/utils/icons'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useWorkflows } from '../providers/workflows-provider'

interface ExecuteWorkflowButtonProps {
  workflowId: string
  status?: GraphWorkflowStatus
}

export function ExecuteWorkflowButton({
  workflowId,
  status
}: ExecuteWorkflowButtonProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const { executeWorkflow, runningWorkflows } = useWorkflows()

  // Check if this workflow is currently running
  const isWorkflowRunning = runningWorkflows.has(workflowId)

  const handleExecute = async () => {
    try {
      setIsExecuting(true)
      await executeWorkflow(workflowId)
      toast.success('Workflow executed successfully')
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  if (isWorkflowRunning || isExecuting) {
    return (
      <Button disabled variant={'secondary'} className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Executing...
      </Button>
    )
  }

  if (status === 'failed') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleExecute}
              variant={'destructive'}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Retry Workflow
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>The previous execution failed. Click to retry.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (status === 'completed') {
    return (
      <Button onClick={handleExecute} variant={'outline'} className="gap-2">
        <LightningIcon className="h-4 w-4" />
        Run Again
      </Button>
    )
  }

  return (
    <Button onClick={handleExecute} variant={'secondary'} className="gap-2">
      <LightningIcon className="h-4 w-4" />
      Execute Workflow
    </Button>
  )
}

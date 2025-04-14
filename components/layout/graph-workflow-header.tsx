'use client'
import { useWorkflows } from '@/components/providers/workflows-provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { GraphWorkflow } from '@/lib/types/workflow'
import { LightningIcon } from '@/lib/utils/icons'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface WorkflowHeaderProps {
  workflow: GraphWorkflow
}

export default function GraphWorkflowHeader({ workflow }: WorkflowHeaderProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const { executeWorkflow, runningWorkflows } = useWorkflows()
  const params = useParams()
  const id = params.id as string

  // Check if this workflow is currently running
  const isWorkflowRunning = runningWorkflows.has(id)

  const handleExecute = async () => {
    try {
      setIsExecuting(true)
      await executeWorkflow(id)
      toast.success('Workflow executed successfully')
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  // Determine button state based on workflow status
  const getExecuteButton = () => {
    if (isWorkflowRunning || isExecuting) {
      return (
        <Button disabled variant={'secondary'} className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Executing...
        </Button>
      )
    }

    if (workflow.status === 'failed') {
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

    if (workflow.status === 'completed') {
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

  return (
    <header className="flex h-16 items-center gap-2 p-4 w-full border-b">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="mr-auto">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-primary">
            {workflow.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Last run status indicator */}
      {workflow.last_run && (
        <div className="text-sm text-muted-foreground flex items-center gap-2 mr-4">
          <span>Last run: {new Date(workflow.last_run).toLocaleString()}</span>
          {workflow.status === 'completed' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {workflow.status === 'failed' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      )}

      {getExecuteButton()}
    </header>
  )
}

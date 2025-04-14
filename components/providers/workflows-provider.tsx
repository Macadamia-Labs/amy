'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { Workflow } from '@/lib/types/workflow'
import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'sonner'

interface WorkflowsContextType {
  workflows: Workflow[]
  executeWorkflow: (id: string) => Promise<void>
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  runningWorkflows: Set<string>
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(
  undefined
)

export function WorkflowsProvider({
  children,
  workflows = []
}: {
  children: ReactNode
  workflows?: Workflow[]
}) {
  const [workflowsState, setWorkflowsState] = useState<Workflow[]>(workflows)
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(
    new Set()
  )

  const { user } = useAuth()

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    setWorkflowsState(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, ...updates } : workflow
      )
    )
  }

  const executeWorkflow = async (id: string) => {
    // Prevent executing a workflow that's already running
    if (runningWorkflows.has(id)) {
      console.warn('Workflow is already running, ignoring execution request')
      return
    }

    try {
      // Mark workflow as running
      setRunningWorkflows(prev => new Set([...prev, id]))

      // Get the workflow
      const workflow = workflowsState.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      console.log('[executeWorkflow] workflow', workflow)

      // Only pass workflowId and userId to the API
      await fetch('/api/execute-workflow', {
        method: 'POST',
        body: JSON.stringify({ workflowId: id, userId: user?.id })
      })
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow')
      throw error
    } finally {
      // Mark workflow as not running
      setRunningWorkflows(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <WorkflowsContext.Provider
      value={{
        workflows: workflowsState,
        executeWorkflow,
        updateWorkflow,
        runningWorkflows
      }}
    >
      {children}
    </WorkflowsContext.Provider>
  )
}

export function useWorkflows() {
  const context = useContext(WorkflowsContext)
  if (context === undefined) {
    throw new Error('useWorkflows must be used within a WorkflowsProvider')
  }
  return context
}

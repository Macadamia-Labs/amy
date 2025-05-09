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
  workflowResults: Record<string, string | null>
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
  const [workflowResults, setWorkflowResults] = useState<
    Record<string, string | null>
  >({})

  const { user } = useAuth()

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    setWorkflowsState(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, ...updates } : workflow
      )
    )
  }

  const executeWorkflow = async (id: string) => {
    // Prevent initiating a workflow that's already running or being initiated
    if (runningWorkflows.has(id)) {
      console.warn(
        '[WorkflowsProvider] Workflow is already running or initiating, ignoring execution request',
        { id }
      )
      toast.info('Workflow execution is already in progress.') // Inform user
      return
    }

    try {
      // Mark workflow as running (or initiating)
      setRunningWorkflows(prev => new Set([...prev, id]))

      // Only pass workflowId and userId to the API
      const response = await fetch('/api/execute-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workflowId: id, userId: user?.id })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) // Try to get error details
        console.error('[WorkflowsProvider] Failed to initiate workflow', {
          id,
          status: response.status,
          errorData
        })
        throw new Error(errorData.error || 'Failed to initiate workflow')
      }

      // The API call was successful in initiating the workflow via Inngest.
      // The actual execution happens in the background.
      // We don't get the result back here anymore.
      console.log(
        '[WorkflowsProvider] Workflow initiation request successful',
        { id }
      )

      // We can optionally update the local workflow state to 'running' here immediately
      // updateWorkflow(id, { status: 'running' }) // Uncomment if desired

      // Result is no longer returned directly
      // setWorkflowResults(prev => ({ ...prev, [id]: undefined })) // Clear previous result if any
    } catch (error) {
      console.error('[WorkflowsProvider] Error initiating workflow:', {
        id,
        error
      })
      // Ensure the error is re-thrown so the button can catch it
      throw error
    } finally {
      // Important: Do NOT remove the workflow from runningWorkflows here.
      // It should be removed when the Inngest function completes/fails.
      // This requires a mechanism to get status updates back to the client
      // (e.g., Supabase real-time subscriptions on the workflows table).
      // For now, we leave it in runningWorkflows until a page refresh or explicit status update.
    }
  }

  return (
    <WorkflowsContext.Provider
      value={{
        workflows: workflowsState,
        executeWorkflow,
        updateWorkflow,
        runningWorkflows,
        workflowResults
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

'use client'

import { createClient } from '@/lib/supabase/client'
import { Workflow } from '@/lib/types/workflow'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { toast } from 'sonner'

interface WorkflowsContextType {
  workflows: Workflow[]
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  removeWorkflow: (id: string) => void
  executeWorkflow: (id: string) => Promise<void>
  runningWorkflows: Set<string>
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(
  undefined
)

export function WorkflowsProvider({
  children,
  initialWorkflows = []
}: {
  children: ReactNode
  initialWorkflows?: Workflow[]
}) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to workflow updates
    const subscription = supabase
      .channel('workflows')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflows'
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            const newWorkflow = payload.new as Workflow
            setWorkflows(prev => [...prev, newWorkflow])
          } else if (payload.eventType === 'UPDATE') {
            const updatedWorkflow = payload.new as Workflow
            setWorkflows(prev =>
              prev.map(workflow =>
                workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow
              )
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedWorkflow = payload.old as Workflow
            setWorkflows(prev =>
              prev.filter(workflow => workflow.id !== deletedWorkflow.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const addWorkflow = (workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow])
  }

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, ...updates } : workflow
      )
    )
  }

  const removeWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
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
      const workflow = workflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      // TODO: Add your execution logic here
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
        workflows,
        addWorkflow,
        updateWorkflow,
        removeWorkflow,
        executeWorkflow,
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

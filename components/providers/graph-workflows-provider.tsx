'use client'

import { workflows as sampleWorkflows } from '@/data'
import { useAuth } from '@/lib/providers/auth-provider'
import {
  buildDependencyMap,
  getExecutionTimestamp,
  getNodeDurations,
  NodeStatus,
  updateWorkflowNode
} from '@/lib/services/workflow-execution'
import { createClient } from '@/lib/supabase/client'
import { CADNode } from '@/lib/types/node-types'
import { GraphWorkflow } from '@/lib/types/workflow'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface WorkflowsContextType {
  workflows: GraphWorkflow[]
  addWorkflow: (workflow: GraphWorkflow) => void
  updateWorkflow: (id: string, updates: Partial<GraphWorkflow>) => void
  removeWorkflow: (id: string) => void
  executeWorkflow: (id: string) => Promise<void>
  runningWorkflows: Set<string>
  nodeStatus: Record<string, NodeStatus>
  nodeProgress: Record<string, number>
  executionLog: string[]
}

const GraphWorkflowsContext = createContext<WorkflowsContextType | undefined>(
  undefined
)

export function GraphWorkflowsProvider({
  children,
  initialWorkflows = []
}: {
  children: ReactNode
  initialWorkflows?: GraphWorkflow[]
}) {
  const { user } = useAuth()
  const [workflows, setWorkflows] = useState<GraphWorkflow[]>([
    ...sampleWorkflows,
    ...initialWorkflows
  ])
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(
    new Set()
  )
  const [nodeStatus, setNodeStatus] = useState<Record<string, NodeStatus>>({})
  const [nodeProgress, setNodeProgress] = useState<Record<string, number>>({})
  const [executionLog, setExecutionLog] = useState<string[]>([])
  // Track processed node IDs to prevent processing nodes multiple times
  const [processedNodeIds, setProcessedNodeIds] = useState<Set<string>>(
    new Set()
  )
  // Track completed node IDs specifically for dependency resolution
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(
    new Set()
  )
  // Track execution attempts for debugging
  const [executionAttempts, setExecutionAttempts] = useState<
    Record<string, number>
  >({})

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
          table: 'workflows',
          filter: `user_id=eq.${user?.id}`
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            const newWorkflow = payload.new as GraphWorkflow
            setWorkflows(prev => [...prev, newWorkflow])
          } else if (payload.eventType === 'UPDATE') {
            const updatedWorkflow = payload.new as GraphWorkflow
            setWorkflows(prev =>
              prev.map(workflow =>
                workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow
              )
            )

            // Update running state if workflow is no longer running
            if (updatedWorkflow.status !== 'running') {
              setRunningWorkflows(prev => {
                const next = new Set(prev)
                next.delete(updatedWorkflow.id)
                return next
              })
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedWorkflow = payload.old as GraphWorkflow
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
  }, [user?.id])

  const addWorkflow = (workflow: GraphWorkflow) => {
    setWorkflows(prev => [...prev, workflow])
  }

  const updateWorkflow = (id: string, updates: Partial<GraphWorkflow>) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, ...updates } : workflow
      )
    )
  }

  const removeWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
  }

  // Add a log entry with timestamp
  const addExecutionLog = (message: string) => {
    const timestamp = getExecutionTimestamp()
    setExecutionLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  // Add a helper function to get a descriptive node name
  const getNodeDescription = (node: CADNode | undefined) => {
    if (!node) return 'Unknown Node'

    // For resource/integration nodes, show the name and description
    if ('name' in node.data && 'description' in node.data) {
      return `${node.data.name} (${node.data.description})`
    }

    // Fallback to label if available
    return node.data.label || node.id
  }

  // This is the single point of truth for updating node state
  const updateNodeState = (
    workflowId: string,
    nodeId: string,
    status: NodeStatus | undefined,
    progress: number
  ) => {
    // Create a single state update for better performance
    const stateUpdates = {}

    // Update the node status state
    if (status) {
      setNodeStatus(prev => ({ ...prev, [nodeId]: status }))
    }

    // Update progress state
    setNodeProgress(prev => ({ ...prev, [nodeId]: progress }))

    // Get the current workflow
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return

    // Create a batch update for the workflow nodes
    const updatedNodes = updateWorkflowNode(workflow, nodeId, {
      status,
      progress
    })

    // Single workflow update call for better performance
    updateWorkflow(workflowId, { nodes: updatedNodes })
  }

  const executeWorkflow = async (id: string) => {
    // Increment execution attempts counter
    const attemptCount = (executionAttempts[id] || 0) + 1
    setExecutionAttempts(prev => ({ ...prev, [id]: attemptCount }))

    // Prevent executing a workflow that's already running
    if (runningWorkflows.has(id)) {
      console.warn('Workflow is already running, ignoring execution request')
      addExecutionLog(
        'WARNING: Workflow is already running, ignoring execution request'
      )
      return
    }

    try {
      console.log(`Execution attempt #${attemptCount} for workflow: ${id}`)

      // Reset ALL execution state to avoid carryover from previous runs
      setExecutionLog([])
      setProcessedNodeIds(new Set())
      setCompletedNodeIds(new Set())
      setNodeStatus({})
      setNodeProgress({})

      addExecutionLog(
        `Starting workflow execution: ${id} (attempt #${attemptCount})`
      )

      // Mark workflow as running
      setRunningWorkflows(prev => new Set([...prev, id]))
      updateWorkflow(id, { status: 'running' })

      // Get the workflow
      const workflow = workflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      // Double check the workflow is now marked as running
      if (workflow.status !== 'running') {
        console.log('Ensuring workflow status is set to running')
        // Force status update to ensure it's running
        updateWorkflow(id, { status: 'running' })
        // Allow state to settle
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // Initialize all nodes as pending with 0% progress
      const initialNodeStatus: Record<string, NodeStatus> = {}
      const initialNodeProgress: Record<string, number> = {}

      workflow.nodes.forEach(node => {
        initialNodeStatus[node.id] = 'pending'
        initialNodeProgress[node.id] = 0
      })

      // Important: set these AFTER resetting all state
      setNodeStatus(initialNodeStatus)
      setNodeProgress(initialNodeProgress)

      // Reset all node statuses in the workflow itself
      const resetNodes = workflow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          status: 'pending',
          progress: 0
        }
      })) as CADNode[]

      updateWorkflow(workflow.id, { nodes: resetNodes })

      addExecutionLog(
        `Initialized ${workflow.nodes.length} nodes with pending status`
      )

      // Wait a moment for all state to be reset
      await new Promise(resolve => setTimeout(resolve, 50))
      console.log('State reset completed, starting execution')

      // Get dependency map and node durations
      const dependencyMap = buildDependencyMap(workflow)
      const nodeDurations = getNodeDurations(workflow)

      // Log the dependency structure with better names
      addExecutionLog('Dependency structure:')
      Object.entries(dependencyMap).forEach(([nodeId, deps]) => {
        const node = workflow.nodes.find(n => n.id === nodeId)
        if (node) {
          const nodeDesc = getNodeDescription(node)
          const depDescs =
            deps.length === 0
              ? 'nothing'
              : deps
                  .map(depId => {
                    const depNode = workflow.nodes.find(n => n.id === depId)
                    return getNodeDescription(depNode)
                  })
                  .join(', ')

          addExecutionLog(`  - ${nodeDesc}: Depends on ${depDescs}`)
        }
      })

      // Execute the workflow nodes based on dependencies
      console.log('Starting simulation with dependency map:', dependencyMap)
      await simulateExecution(workflow, dependencyMap, nodeDurations)

      console.log('Simulation completed successfully')
      addExecutionLog('Workflow execution completed successfully')

      // Update workflow status to completed
      updateWorkflow(id, {
        status: 'completed',
        last_run: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error executing workflow:', error)
      addExecutionLog(
        `ERROR: ${error instanceof Error ? error.message : String(error)}`
      )
      updateWorkflow(id, { status: 'failed' })
    } finally {
      setRunningWorkflows(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  // Simulate execution of workflow nodes
  const simulateExecution = async (
    workflow: GraphWorkflow,
    dependencyMap: Record<string, string[]>,
    nodeDurations: Record<string, number>
  ) => {
    console.log('Initializing simulation with local state tracking')

    // Create local tracking sets to ensure consistent state during execution
    const localProcessedNodeIds = new Set<string>()
    const localCompletedNodeIds = new Set<string>()

    // Create a local copy of node status to avoid race conditions with React state updates
    const localNodeStatus: Record<string, NodeStatus> = {}

    // Initialize all nodes as pending in our local state
    workflow.nodes.forEach(node => {
      localNodeStatus[node.id] = 'pending'
    })

    // Continue execution until all nodes are processed
    let remainingIterations = 100 // Safety limit

    while (remainingIterations > 0) {
      remainingIterations--

      // Debug log to track state
      console.log(
        'Iteration:',
        100 - remainingIterations,
        'Processed:',
        Array.from(localProcessedNodeIds),
        'Completed:',
        Array.from(localCompletedNodeIds)
      )

      // Find nodes that can be executed now based on dependencies and completed nodes
      const executableNodeIds = workflow.nodes
        .filter(node => {
          // Skip nodes that aren't pending or have already been processed
          // Using local state instead of global state to avoid race conditions
          if (
            localNodeStatus[node.id] !== 'pending' ||
            localProcessedNodeIds.has(node.id)
          ) {
            return false
          }

          // Check if all dependencies are completed
          const dependencies = dependencyMap[node.id] || []
          return dependencies.every(depId => localCompletedNodeIds.has(depId))
        })
        .map(node => node.id)

      // If no more nodes can be executed, we're done or have a problem
      if (executableNodeIds.length === 0) {
        // Check if any nodes are still pending
        const pendingNodes = workflow.nodes.filter(
          node =>
            localNodeStatus[node.id] === 'pending' &&
            !localProcessedNodeIds.has(node.id)
        )

        if (pendingNodes.length === 0) {
          // All nodes completed successfully
          addExecutionLog('All nodes have been processed')
          break
        } else {
          // Some nodes couldn't be executed - likely a circular dependency
          addExecutionLog(
            `WARNING: ${pendingNodes.length} nodes could not be executed due to unmet dependencies`
          )

          // Mark remaining nodes as failed
          for (const node of pendingNodes) {
            updateNodeState(workflow.id, node.id, 'failed', 0)
            localProcessedNodeIds.add(node.id)
            setProcessedNodeIds(prev => {
              const next = new Set(prev)
              next.add(node.id)
              return next
            })
            addExecutionLog(
              `  - Failed: ${getNodeDescription(
                node
              )} (dependencies unresolvable)`
            )
          }
          break
        }
      }

      // Log which nodes are now executing
      if (executableNodeIds.length > 0) {
        addExecutionLog(`Executing ${executableNodeIds.length} node(s):`)

        // Mark all nodes as processed BEFORE executing them
        executableNodeIds.forEach(id => {
          localProcessedNodeIds.add(id)

          // Also update the state for UI tracking
          setProcessedNodeIds(prev => {
            const next = new Set(prev)
            next.add(id)
            return next
          })

          const node = workflow.nodes.find(n => n.id === id)
          addExecutionLog(
            `  - ${getNodeDescription(node)} (duration: ${
              nodeDurations[id] / 1000
            }s)`
          )
        })
      }

      // Execute all ready nodes in parallel and wait for them to complete
      await Promise.all(
        executableNodeIds.map(nodeId =>
          executeNode(
            workflow,
            nodeId,
            nodeDurations[nodeId],
            localCompletedNodeIds,
            localNodeStatus
          )
        )
      )

      // Add a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    if (remainingIterations <= 0) {
      addExecutionLog('WARNING: Execution halted due to too many iterations')
    }

    // Update the global state sets at the end
    setProcessedNodeIds(new Set(localProcessedNodeIds))
    setCompletedNodeIds(new Set(localCompletedNodeIds))
  }

  // Execute a single node with progress updates
  const executeNode = async (
    workflow: GraphWorkflow,
    nodeId: string,
    duration: number,
    localCompletedNodeIds: Set<string>,
    localNodeStatus: Record<string, NodeStatus>
  ) => {
    // Safety check - don't execute a node that has already been processed or isn't pending
    if (localCompletedNodeIds.has(nodeId)) {
      console.warn(`Skipping node ${nodeId} as it's already processed`)
      return
    }

    try {
      // Update local status first
      localNodeStatus[nodeId] = 'running'

      // Mark node as running
      updateNodeState(workflow.id, nodeId, 'running', 0)

      // More reliable wait to ensure UI updates correctly
      await new Promise(resolve => setTimeout(resolve, 50))

      // Simulate progress updates
      const steps = 10 // Update progress ~10 times
      const interval = duration / steps

      for (let i = 1; i <= steps; i++) {
        // Wait for the interval time
        await new Promise(resolve => setTimeout(resolve, interval))

        // Calculate progress as percentage
        const progress = Math.min((i / steps) * 100, 100)

        // Update progress state
        updateNodeState(workflow.id, nodeId, 'running', progress)

        // Small delay to let UI update every few steps
        if (i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }

      // Ensure full duration has passed
      if (steps * interval < duration) {
        await new Promise(resolve =>
          setTimeout(resolve, duration - steps * interval)
        )
      }

      // Update local status
      localNodeStatus[nodeId] = 'completed'

      // Mark node as completed (single update for all state)
      updateNodeState(workflow.id, nodeId, 'completed', 100)

      // Add to completed nodes for dependency tracking
      localCompletedNodeIds.add(nodeId)
      setCompletedNodeIds(prev => {
        const next = new Set(prev)
        next.add(nodeId)
        return next
      })

      const node = workflow.nodes.find(n => n.id === nodeId)
      addExecutionLog(`Completed: ${getNodeDescription(node)}`)
    } catch (error) {
      console.error(`Error executing node ${nodeId}:`, error)

      // Update local status
      localNodeStatus[nodeId] = 'failed'

      // Mark node as failed
      updateNodeState(workflow.id, nodeId, 'failed', 0)

      const node = workflow.nodes.find(n => n.id === nodeId)
      addExecutionLog(
        `FAILED: ${getNodeDescription(node)} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  return (
    <GraphWorkflowsContext.Provider
      value={{
        workflows,
        addWorkflow,
        updateWorkflow,
        removeWorkflow,
        executeWorkflow,
        runningWorkflows,
        nodeStatus,
        nodeProgress,
        executionLog
      }}
    >
      {children}
    </GraphWorkflowsContext.Provider>
  )
}

export function useGraphWorkflows() {
  const context = useContext(GraphWorkflowsContext)
  if (context === undefined) {
    throw new Error(
      'useGraphWorkflows must be used within a GraphWorkflowsProvider'
    )
  }
  return context
}

// Add the missing useWorkflows export
export const useWorkflows = useGraphWorkflows;

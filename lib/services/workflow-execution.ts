import { CADNode } from '@/lib/types/node-types'
import { GraphWorkflow } from '@/lib/types/workflow'

export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ExecutionState {
  nodeStatus: Record<string, NodeStatus>
  nodeProgress: Record<string, number>
}

interface DependencyMap {
  [nodeId: string]: string[] // Array of dependency node IDs
}

interface NodeDurations {
  [nodeId: string]: number
}

/**
 * Build a map of node dependencies based on the workflow edges
 * Maps node IDs to arrays of dependency node IDs
 */
export function buildDependencyMap(
  workflow: GraphWorkflow
): Record<string, string[]> {
  const dependencyMap: Record<string, string[]> = {}

  // Initialize all nodes with empty dependencies
  workflow.nodes.forEach(node => {
    dependencyMap[node.id] = []
  })

  // For each edge, add the source as a dependency of the target
  workflow.edges.forEach(edge => {
    const sourceId = edge.source
    const targetId = edge.target

    // Validate that source and target exist
    const sourceExists = workflow.nodes.some(node => node.id === sourceId)
    const targetExists = workflow.nodes.some(node => node.id === targetId)

    if (sourceExists && targetExists) {
      if (!dependencyMap[targetId]) {
        dependencyMap[targetId] = []
      }

      // Only add the dependency if it doesn't already exist
      if (!dependencyMap[targetId].includes(sourceId)) {
        dependencyMap[targetId].push(sourceId)
      }
    } else {
      console.warn(
        `Invalid edge: ${sourceId} -> ${targetId}. One or both nodes do not exist.`
      )
    }
  })

  // Detect and log circular dependencies (just for debugging)
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function detectCycle(nodeId: string): boolean {
    if (!visited.has(nodeId)) {
      visited.add(nodeId)
      recursionStack.add(nodeId)

      const dependencies = dependencyMap[nodeId] || []
      for (const depId of dependencies) {
        if (!visited.has(depId) && detectCycle(depId)) {
          return true
        } else if (recursionStack.has(depId)) {
          console.warn(
            `Circular dependency detected: ${nodeId} depends on ${depId}`
          )
          return true
        }
      }
    }
    recursionStack.delete(nodeId)
    return false
  }

  // Check each node for circular dependencies
  for (const nodeId of Object.keys(dependencyMap)) {
    if (!visited.has(nodeId)) {
      detectCycle(nodeId)
    }
  }

  return dependencyMap
}

/**
 * Gets node durations from workflow nodes
 * Ensures each node has a duration (defaults to random between 3-7 seconds)
 */
export function getNodeDurations(workflow: GraphWorkflow): NodeDurations {
  const durations: NodeDurations = {}

  workflow.nodes.forEach(node => {
    // Use provided duration or a random value between 3000-7000ms
    durations[node.id] =
      node.data.duration || Math.floor(Math.random() * 4000) + 3000
  })

  return durations
}

/**
 * Find nodes that can be executed now (all dependencies are met)
 */
export function findExecutableNodes(
  workflow: GraphWorkflow,
  dependencyMap: Record<string, string[]>,
  nodeStatus: Record<string, NodeStatus>
): string[] {
  return workflow.nodes
    .filter(node => {
      // Only consider pending nodes
      if (nodeStatus[node.id] !== 'pending') {
        return false
      }

      // Check if all dependencies are completed
      const dependencies = dependencyMap[node.id] || []
      return dependencies.every(depId => nodeStatus[depId] === 'completed')
    })
    .map(node => node.id)
}

/**
 * Updates a single node in the workflow with new status and progress
 */
export function updateWorkflowNode(
  workflow: GraphWorkflow,
  nodeId: string,
  updates: {
    status?: NodeStatus
    progress?: number
  }
): CADNode[] {
  return workflow.nodes.map(node =>
    node.id === nodeId
      ? {
          ...node,
          data: {
            ...node.data,
            ...(updates.status !== undefined ? { status: updates.status } : {}),
            ...(updates.progress !== undefined
              ? { progress: updates.progress }
              : {})
          }
        }
      : node
  ) as CADNode[]
}

/**
 * Generates a timestamp for logging execution events
 */
export function getExecutionTimestamp(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`
}

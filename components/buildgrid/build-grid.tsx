'use client'

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import '@xyflow/react/dist/style.css'

import { GeometryNode } from '@/components/nodes/geometry-node'
import { MaterialNode } from '@/components/nodes/material-node'
import {
  IntegrationNode,
  ResourceNode,
  StandardNode
} from '@/components/nodes/resource-node'
import { SimulationNode } from '@/components/nodes/simulation-node'
import { SpecsNode } from '@/components/nodes/specs-node'
import { useWorkflows } from '@/components/providers/graph-workflows-provider'
import { CADNode } from '@/lib/types/node-types'

// Define a more flexible type for node types to accommodate type checking
const nodeTypes = {
  simulation: SimulationNode,
  geometry: GeometryNode,
  specs: SpecsNode,
  material: MaterialNode,
  resource: ResourceNode,
  standard: StandardNode,
  integration: IntegrationNode
} as NodeTypes

const snapGrid: [number, number] = [20, 20]
const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

// Edge style definitions with better organization
const edgeStyles = {
  default: { stroke: '#64748b', strokeWidth: 1 },
  active: { stroke: '#3b82f6', strokeWidth: 2 },
  completed: { stroke: '#22c55e', strokeWidth: 2 },
  failed: { stroke: '#ef4444', strokeWidth: 2 }
}

interface BuildGridProps {
  workflowId?: string
}

export const BuildGrid = ({ workflowId = 'workflow-1' }: BuildGridProps) => {
  const { workflows, nodeStatus, nodeProgress } = useWorkflows()
  const [nodes, setNodes, onNodesChange] = useNodesState<CADNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Track initialization to prevent animations on first load
  const initialized = useRef(false)

  // Use this to track the last updated status to avoid unnecessary re-renders
  const [lastStatusUpdate, setLastStatusUpdate] = useState<number>(0)

  // Get current workflow
  const workflow = workflows.find(w => w.id === workflowId)

  // Initialize nodes and edges from workflow
  useEffect(() => {
    if (!workflow) return

    // First time initialization
    if (!initialized.current) {
      // Set nodes with initial status
      setNodes(
        workflow.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            status: nodeStatus[node.id] || 'pending',
            progress: nodeProgress[node.id] || 0
          }
        }))
      )

      // Set edges with no animation initially
      setEdges(
        workflow.edges.map(edge => ({
          ...edge,
          animated: false,
          style: edgeStyles.default
        }))
      )

      initialized.current = true
      setLastStatusUpdate(Date.now())
    }
  }, [workflow, nodeStatus, nodeProgress, setNodes, setEdges])

  // Separate effect to handle node status and progress updates
  useEffect(() => {
    if (!initialized.current || !workflow) return

    // Update nodes with latest status and progress
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          status: nodeStatus[node.id] || node.data.status,
          progress:
            nodeProgress[node.id] !== undefined
              ? nodeProgress[node.id]
              : node.data.progress
        }
      }))
    )

    // Record this update timestamp
    setLastStatusUpdate(Date.now())
  }, [nodeStatus, nodeProgress, workflow, setNodes, setEdges])

  // Handle edge updates separately for better performance
  useEffect(() => {
    if (!initialized.current || !workflow) return

    // Debounce edge updates slightly to ensure node states are settled
    const timer = setTimeout(() => {
      const updatedEdges = workflow.edges.map(edge => {
        const sourceStatus = nodeStatus[edge.source] || 'pending'
        const targetStatus = nodeStatus[edge.target] || 'pending'

        // Determine edge style and animation based on connected nodes' statuses
        let style = { ...edgeStyles.default }
        let animated = false

        // Active flow: source is completed and target is processing
        if (sourceStatus === 'completed' && targetStatus === 'running') {
          style = { ...edgeStyles.active }
          animated = true
        }
        // Connection is ready but not yet flowing
        else if (sourceStatus === 'running' && targetStatus === 'pending') {
          style = { ...edgeStyles.active }
          animated = false
        }
        // Both nodes completed successfully
        else if (sourceStatus === 'completed' && targetStatus === 'completed') {
          style = { ...edgeStyles.completed }
          animated = false
        }
        // One or both nodes failed
        else if (sourceStatus === 'failed' || targetStatus === 'failed') {
          style = { ...edgeStyles.failed }
          animated = false
        }

        return {
          ...edge,
          animated,
          style
        }
      })

      setEdges(updatedEdges)
    }, 10) // Small timeout for debouncing

    return () => clearTimeout(timer)
  }, [lastStatusUpdate, workflow, setNodes, setEdges, nodeStatus])

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      // Add new edge with default style and no animation
      setEdges(eds =>
        addEdge(
          {
            ...params,
            animated: false,
            style: edgeStyles.default,
            type: 'default'
          },
          eds
        )
      )
    },
    [setEdges]
  )

  // Function to determine if we should animate an edge
  const shouldAnimateEdge = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceStatus = nodeStatus[sourceId]
      const targetStatus = nodeStatus[targetId]

      // Animate only when data is flowing from completed to running
      return sourceStatus === 'completed' && targetStatus === 'running'
    },
    [nodeStatus]
  )

  const proOptions = { hideAttribution: true }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={snapGrid}
      defaultViewport={defaultViewport}
      fitView
      attributionPosition="bottom-left"
      proOptions={proOptions}
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls className="text-primary bg-muted" />
    </ReactFlow>
  )
}

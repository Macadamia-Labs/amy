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
import { useCallback, useEffect } from 'react'

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
import { CADNode } from '@/lib/types/node-types'

const snapGrid: [number, number] = [20, 20]
const nodeTypes: NodeTypes = {
  simulation: SimulationNode,
  geometry: GeometryNode,
  specs: SpecsNode,
  material: MaterialNode,
  resource: ResourceNode,
  standard: StandardNode,
  integration: IntegrationNode
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

export const BuildGrid = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CADNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    const initialNodes: CADNode[] = [
      {
        id: 'specs1',
        type: 'specs',
        position: { x: 0, y: 50 },
        data: {
          type: 'specs',
          label: 'Project Requirements',
          requirements: ['Max load: 1000N', 'Min safety factor: 2.0'],
          constraints: {
            maxWidth: 100,
            maxHeight: 50
          }
        }
      },
      {
        id: 'resource1',
        type: 'standard',
        position: { x: 0, y: 200 },
        data: {
          type: 'standard',
          label: 'Design Standard',
          name: 'Design Standard',
          description: 'Process Piping Design Standards',
          standardCode: 'ASME B31.3'
        }
      },
      {
        id: 'resource2',
        type: 'integration',
        position: { x: 0, y: 350 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'BOM Vessel #3',
          description: 'Bill of Materials',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
      {
        id: 'resource3',
        type: 'integration',
        position: { x: 0, y: 500 },
        data: {
          type: 'integration',
          label: 'Confluence',
          name: 'Design Documentation',
          description: 'Project Requirements & Specs',
          integration: {
            type: 'Confluence',
            logoSrc: '/integrations/confluence.avif'
          }
        }
      },
      {
        id: 'resource4',
        type: 'integration',
        position: { x: 0, y: 650 },
        data: {
          type: 'integration',
          label: 'Ansys',
          name: 'Ansys Workbench',
          description: 'FEA Simulation Setup',
          integration: {
            type: 'Ansys',
            logoSrc: '/integrations/ansys.avif'
          }
        }
      },
      {
        id: 'geometry1',
        type: 'geometry',
        position: { x: 300, y: 50 },
        data: {
          type: 'geometry',
          label: 'Part Geometry',
          shape: 'cylinder',
          dimensions: {
            radius: 25,
            height: 100
          }
        }
      },
      {
        id: 'material1',
        type: 'material',
        position: { x: 300, y: 200 },
        data: {
          type: 'material',
          label: 'Material Selection',
          material: 'Aluminum 6061',
          properties: {
            density: 2.7,
            elasticity: 69
          }
        }
      },
      {
        id: 'simulation1',
        type: 'simulation',
        position: { x: 600, y: 125 },
        data: {
          type: 'simulation',
          label: 'Stress Analysis',
          simulationType: 'static',
          parameters: {
            meshSize: 2.5,
            loadMagnitude: 1000
          }
        }
      }
    ]

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'specs1',
        target: 'geometry1',
        animated: true
      },
      {
        id: 'er1-2',
        source: 'resource1',
        target: 'geometry1',
        animated: true
      },
      {
        id: 'e2-4',
        source: 'geometry1',
        target: 'simulation1',
        animated: true
      },
      {
        id: 'e3-4',
        source: 'material1',
        target: 'simulation1',
        animated: true
      }
    ]

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [])

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges(eds => addEdge({ ...params, animated: true }, eds)),
    []
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

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
        id: 'resource1',
        type: 'standard',
        position: { x: 500, y: 280 },
        data: {
          type: 'standard',
          label: 'Design Standard',
          name: 'Extracted Design Parameters',
          description: 'Pressure vessel parameters',
          standardCode: 'E'
        }
      },
      {
        id: 'resource2',
        type: 'integration',
        position: { x: 150, y: 150 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'Pressure Vessel Requirements',
          description: 'Customer specifications',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
      {
        id: 'resource3',
        type: 'integration',
        position: { x: 1200, y: 360 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'Technical Drawing',
          description: 'Pressure Vessel',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
      {
        id: 'resource8',
        type: 'integration',
        position: { x: 1200, y: 480 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'Bill of Materials',
          description: 'Pressure Vessel Components',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
      {
        id: 'resource7',
        type: 'integration',
        position: { x: 1500, y: 150 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'Simulation Report',
          description: 'Static Pressure Analysis',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
      {
        id: 'resource4',
        type: 'integration',
        position: { x: 1200, y: 150 },
        data: {
          type: 'integration',
          label: 'Ansys',
          name: 'Ansys Mechanical',
          description: 'FEA Simulation Setup',
          integration: {
            type: 'Ansys',
            logoSrc: '/integrations/ansys.avif'
          }
        }
      },
      /* Commented out nodes
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
        id: 'material2',
        type: 'material',
        position: { x: 300, y: 200 },
        data: {
          type: 'material',
          label: 'Extracted pressure vessel parameters',
          material: 'Steel A516 Grade 70',
          properties: {
            density: 7.85,
            elasticity: 200
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
      },
      */
      {
        id: 'resource5',
        type: 'integration',
        position: { x: 900, y: 280 },
        data: {
          type: 'integration',
          label: 'DS',
          name: 'Solidworks',
          description: '3D CAD model',
          integration: {
            type: 'DS',
            logoSrc: '/integrations/DS.avif'
          }
        }
      },
      {
        id: 'resource6',
        type: 'integration',
        position: { x: 150, y: 360 },
        data: {
          type: 'integration',
          label: 'Google Drive',
          name: 'ASME standards',
          description: 'ASME standards',
          integration: {
            type: 'Google Drive',
            logoSrc: '/integrations/gdrive.avif'
          }
        }
      },
    ]

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'resource2',
        target: 'resource1',
        animated: true
      },
      {
        id: 'e2-3',
        source: 'resource6',
        target: 'resource1',
        animated: true
      },
      {
        id: 'e3-4',
        source: 'resource1',
        target: 'resource5',
        animated: true
      },
      {
        id: 'e4-5',
        source: 'resource5',
        target: 'resource3',
        animated: true
      },
      {
        id: 'e5-6',
        source: 'resource5',
        target: 'resource4',
        animated: true
      },
      {
        id: 'e6-7',
        source: 'resource4',
        target: 'resource7',
        animated: true
      },
      {
        id: 'e5-8',
        source: 'resource5',
        target: 'resource8',
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

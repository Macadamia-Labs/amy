import { CADNode } from '@/lib/types/node-types'
import { Workflow } from '@/lib/types/workflow'
import { Edge } from '@xyflow/react'

// Sample workflow nodes based on the BuildGrid component
const pressureVesselNodes: CADNode[] = [
  {
    id: 'resource1',
    type: 'standard',
    position: { x: 500, y: 280 },
    data: {
      type: 'standard',
      label: 'Design Standard',
      name: 'Extracted Design Parameters',
      description: 'Pressure vessel parameters',
      standardCode: 'E',
      duration: 4000 // 4 seconds
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
      },
      duration: 3500 // 3.5 seconds
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
      },
      duration: 5000 // 5 seconds
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
      },
      duration: 4200 // 4.2 seconds
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
      },
      duration: 3000 // 3 seconds
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
      },
      duration: 6000 // 6 seconds
    }
  },
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
      },
      duration: 5500 // 5.5 seconds
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
      },
      duration: 3800 // 3.8 seconds
    }
  }
]

// Sample workflow edges based on the BuildGrid component
const pressureVesselEdges: Edge[] = [
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

// Sample workflows data
export const workflows: Workflow[] = [
  {
    id: 'workflow-1',
    title: 'Pressure Vessel Design',
    description:
      'Workflow for designing pressure vessels according to ASME standards',
    status: 'active',
    nodes: pressureVesselNodes,
    edges: pressureVesselEdges,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    last_run: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'workflow-2',
    title: 'Heat Exchanger Analysis',
    description: 'Thermal analysis workflow for shell and tube heat exchangers',
    status: 'draft',
    nodes: [],
    edges: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  },
  {
    id: 'workflow-3',
    title: 'Structural FEA Pipeline',
    description: 'End-to-end workflow for structural finite element analysis',
    status: 'completed',
    nodes: [],
    edges: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    last_run: new Date(Date.now() - 172800000).toISOString()
  }
]

// Helper function to get a workflow by ID
export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find(workflow => workflow.id === id)
}

// Helper function to get all workflows
export function getAllWorkflows(): Workflow[] {
  return workflows
}

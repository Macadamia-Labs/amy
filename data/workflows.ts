import { CADNode } from '@/lib/types/node-types'
import { Workflow } from '@/lib/types/workflow'
import { Edge } from '@xyflow/react'

// Sample workflow nodes based on the BuildGrid component
const pressureVesselNodes: CADNode[] = [
  {
    id: 'resource1',
    type: 'standard',
    position: { x: 550, y: 380 },
    data: {
      type: 'standard',
      label: 'Design Standard',
      name: 'Extracted Design Parameters',
      description: 'Pressure vessel parameters',
      standardCode: 'E',
      duration: 2000 // 4 seconds
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
      duration: 2000 // 3.5 seconds
    }
  },
  {
    id: 'resource3',
    type: 'integration',
    position: { x: 1250, y: 380 },
    data: {
      type: 'integration',
      label: 'Google Drive',
      name: 'Technical Drawing',
      description: 'Pressure Vessel',
      integration: {
        type: 'Google Drive',
        logoSrc: '/integrations/gdrive.avif'
      },
      duration: 1000 // 5 seconds
    }
  },
  {
    id: 'resource8',
    type: 'integration',
    position: { x: 1250, y: 680 },
    data: {
      type: 'integration',
      label: 'Confluence',
      name: 'Bill of Materials',
      description: 'Pressure Vessel Components',
      integration: {
        type: 'Confluence',
        logoSrc: '/integrations/confluence.avif'
      },
      duration: 1500 // 4.2 seconds
    }
  },
  {
    id: 'resource7',
    type: 'integration',
    position: { x: 1600, y: 380 },
    data: {
      type: 'integration',
      label: 'Google Drive',
      name: 'Simulation Report',
      description: 'Static Pressure Analysis',
      integration: {
        type: 'Google Drive',
        logoSrc: '/integrations/gdrive.avif'
      },
      duration: 500 // 3 seconds
    }
  },
  {
    id: 'resource9',
    type: 'integration',
    position: { x: 1600, y: 120 },
    data: {
      type: 'integration',
      label: 'Ansys',
      name: 'FEA Animation',
      description: 'Circumferential stress',
      integration: {
        type: 'Ansys',
        logoSrc: '/integrations/ansys.avif'
      },
      duration: 500 // 4.5 seconds
    }
  },
  {
    id: 'resource4',
    type: 'integration',
    position: { x: 1250, y: 200 },
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
    position: { x: 950, y: 380 },
    data: {
      type: 'integration',
      label: 'DS',
      name: 'Solidworks',
      description: '3D CAD model',
      integration: {
        type: 'DS',
        logoSrc: '/integrations/DS.avif'
      },
      duration: 2000 // 5.5 seconds
    }
  },
  {
    id: 'resource6',
    type: 'integration',
    position: { x: 150, y: 600 },
    data: {
      type: 'integration',
      label: 'OneDrive',
      name: 'ASME standards',
      description: 'ASME standards',
      integration: {
        type: 'OneDrive',
        logoSrc: '/integrations/onedrive.avif'
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
    id: 'e6-9',
    source: 'resource4',
    target: 'resource9',
    animated: true
  },
  {
    id: 'e4-7',
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
      'Pressure vessel design according to ASME standards',
    status: 'active',
    nodes: pressureVesselNodes,
    edges: pressureVesselEdges,
    created_at: new Date(Date.now() - 1728000000).toISOString(),
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
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  },
  {
    id: 'workflow-3',
    title: 'Cooled Turbine Blade',
    description: 'Thermal stress analysis in Ansys Mechanical',
    status: 'completed',
    nodes: [],
    edges: [],
    created_at: new Date(Date.now() - 1728000000).toISOString(),
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

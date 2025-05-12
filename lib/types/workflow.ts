import { Edge } from '@xyflow/react'
import { Engineer, Resource } from '.'
import { CADNode } from './node-types'

export interface Workflow {
  id: string
  title: string
  description: string
  instructions: string
  icon?: string
  resourceIds?: string[]
  status: GraphWorkflowStatus
  result?: string | null
}

export type GraphWorkflowStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'failed'
  | 'running'

export interface GraphWorkflow {
  id: string
  title: string
  description: string
  status: GraphWorkflowStatus
  nodes: CADNode[]
  edges: Edge[]
  created_at: string
  updated_at: string
  user_id: string
  creator?: Engineer
  resources?: Resource[]
  last_run?: string
  execution_history?: GraphWorkflowExecution[]
}

export interface GraphWorkflowExecution {
  id: string
  workflow_id: string
  status: 'success' | 'failed' | 'running'
  started_at: string
  completed_at?: string
  logs?: string[]
  results?: Record<string, any>
}

export type WorkflowStatus = "processing" | "completed" | "error";


export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: WorkflowStatus;
  status_message?: string;
  created_at: string;
  resource_ids: string[];
  output_resource_id?: string | null;
  updated_at?: string;
}

import { Edge } from '@xyflow/react'
import { Engineer, Resource } from '.'
import { CADNode } from './node-types'

export type WorkflowStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'failed'
  | 'running'

export interface Workflow {
  id: string
  title: string
  description: string
  status: WorkflowStatus
  nodes: CADNode[]
  edges: Edge[]
  created_at: string
  updated_at: string
  user_id: string
  creator?: Engineer
  resources?: Resource[]
  last_run?: string
  execution_history?: WorkflowExecution[]
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: 'success' | 'failed' | 'running'
  started_at: string
  completed_at?: string
  logs?: string[]
  results?: Record<string, any>
}

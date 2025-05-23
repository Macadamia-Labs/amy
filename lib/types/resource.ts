import { ReactElement } from 'react'
import { ResourceStatus } from './index'

export interface Resource {
  id: string
  title: string
  description?: string
  category: string
  origin: string
  status: ResourceStatus
  processing_error?: string
  created_at: string
  is_folder?: boolean
  parent_id?: string
}

export type ResourceIconProps = {
  className?: string
}

export type ResourceIcon = ReactElement<ResourceIconProps>

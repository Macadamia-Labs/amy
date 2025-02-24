import { ReactElement } from 'react'

export interface Resource {
  id: string
  title: string
  description?: string
  category: string
  origin: string
  status: 'loading' | 'processing' | 'completed' | 'error'
  processing_error?: string
  created_at: string
  is_folder?: boolean
  parent_id?: string
}

export type ResourceIconProps = {
  className?: string
}

export type ResourceIcon = ReactElement<ResourceIconProps>

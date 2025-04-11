import { ResourceStatus } from './index'

export interface Chat {
  id: string
  title: string
  user_id: string
  app: string
  created_at: string
  updated_at: string
  last_message_at: string
  messages: any[]
  files?: FileRecord[]
  is_shared: boolean
  share_path: string
}

export type FileType = 'script' | 'data' | 'input'

export interface BaseFileRecord {
  id: string
  name: string
  type: FileType
  content: string
  user_id: string
  created_at: string
  updated_at: string
  path?: string
}

export interface ScriptFileRecord extends BaseFileRecord {
  type: 'script'
  language?: string
  framework?: string
}

export interface DataFileRecord extends BaseFileRecord {
  type: 'data'
  format?: string
}

export interface InputFileRecord extends BaseFileRecord {
  type: 'input'
}

export type FileRecord = ScriptFileRecord | DataFileRecord | InputFileRecord

export interface Report {
  id: string
  user_id: string
  name: string
  instructions?: string
  content?: string
  input_files: string[]
  error?: string
  created_at: string
  updated_at: string
  language?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  content: string
  content_as_text?: string
  category: string
  file_path: string
  file_type: string
  user_id: string
  created_at: string
  updated_at: string
  file_url?: string
  embeddings?: any[]
  status: ResourceStatus
  processing_result?: {
    outline: any[]
  }
  origin?: string
}

export interface Project {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  color?: string
}

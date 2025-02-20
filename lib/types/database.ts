export interface Project {
  id: string
  name: string
  description?: string
  user_id: string
  app: string
  created_at: string
  updated_at: string
  simulations: Simulation[]
}

export interface Simulation {
  id: string
  project_id: string
  name: string
  description?: string
  status: 'new' | 'running' | 'completed' | 'failed'
  input_files?: string[]
  report_id?: string
  created_at: string
  updated_at: string
  messages?: any[]
}

export interface Version {
  id: string
  project_id: string
  title: string
  description: string
  code: string
  created_at: string
  updated_at: string
}

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

export interface ResourceRecord {
  id: string
  title: string
  description: string
  category:
    | 'Engineering Drawings'
    | 'ASME Standards'
    | 'ACE Standards'
    | 'Excel Sheets'
    | 'Email Chains'
  file_path: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  user_id: string
  created_at: string
}

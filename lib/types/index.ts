import { CoreMessage, JSONValue } from 'ai'

export type SearchResults = {
  images: SearchResultImage[]
  results: SearchResultItem[]
  number_of_results?: number
  query: string
}

// If enabled the include_images_description is true, the images will be an array of { url: string, description: string }
// Otherwise, the images will be an array of strings
export type SearchResultImage =
  | string
  | {
      url: string
      description: string
      number_of_results?: number
    }

export type ExaSearchResults = {
  results: ExaSearchResultItem[]
}

export type SerperSearchResults = {
  searchParameters: {
    q: string
    type: string
    engine: string
  }
  videos: SerperSearchResultItem[]
}

export type SearchResultItem = {
  title: string
  url: string
  content: string
}

export type RetrieveResults = RetrieveResultItem[]

export type RetrieveResultItem = {
  id: string
  content: string
  metadata: object
}

export type ExaSearchResultItem = {
  score: number
  title: string
  id: string
  url: string
  publishedDate: Date
  author: string
}

export type SerperSearchResultItem = {
  title: string
  link: string
  snippet: string
  imageUrl: string
  duration: string
  source: string
  channel: string
  date: string
  position: number
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: ExtendedCoreMessage[] // Note: Changed from AIMessage to ExtendedCoreMessage
  sharePath?: string
}

// ExtendedCoreMessage for saveing annotations
export type ExtendedCoreMessage = Omit<CoreMessage, 'role' | 'content'> & {
  role: CoreMessage['role'] | 'data'
  content: CoreMessage['content'] | JSONValue
}

export type AIMessage = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
  type?:
    | 'answer'
    | 'related'
    | 'skip'
    | 'inquiry'
    | 'input'
    | 'input_related'
    | 'tool'
    | 'followup'
    | 'end'
}

export interface SearXNGResult {
  title: string
  url: string
  content: string
  img_src?: string
  publishedDate?: string
  score?: number
}

export interface SearXNGResponse {
  query: string
  number_of_results: number
  results: SearXNGResult[]
}

export type SearXNGImageResult = string

export type SearXNGSearchResults = {
  images: SearXNGImageResult[]
  results: SearchResultItem[]
  number_of_results?: number
  query: string
}

export interface Engineer {
  id: string
  name: string
  title: string
  specialty: string
  email: string
}

export interface Comment {
  id: string
  content: string
  author: Engineer
  createdAt: Date
  updatedAt: Date
}

export type IssueType =
  | 'Design Error'
  | 'Production Error'
  | 'Construction Error'
  | 'Maintenance Error'
  | 'Safety Error'
  | 'Other'

export type IssueCategory =
  | 'Production'
  | 'Construction'
  | 'Maintenance'
  | 'Safety'
  | 'Design'
  | 'Specification'
  | 'Calculation'
  | 'Other'

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  category: IssueCategory
  location: string
  assignedEngineer?: Engineer
  createdAt: Date
  updatedAt: Date
  proposedSolution?: string
  resources: Resource[]
  affectedWorkflows?: Array<{
    id: string
    title: string
    status: 'draft' | 'active' | 'completed' | 'failed' | 'running'
  }>
  comments?: Comment[]
  standards?: Array<{
    id: string
    code: string
    name: string
    category: string
    description: string
    lastUpdated: Date
    relevantSections: string[]
  }>
  documents?: Array<{
    id: string
    type: string
    title: string
    fileUrl: string
    version: string
    createdAt: Date
    updatedAt: Date
    status: string
  }>
  severity?: string
}

export type ResourceOrigin =
  | 'drive'
  | 'confluence'
  | 'solidworks'
  | 'matlab'
  | string

export type ResourceStatus = 'pending' | 'processing' | 'completed' | 'error'

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  file_type: string
  user_id: string
  created_at: string
  origin?: ResourceOrigin
  processed?: boolean
  processing_result?: any
  processing_completed_at?: string
  status?: ResourceStatus
  processing_error?: string
  is_folder?: boolean
  parent_id?: string | null
  content_as_text?: string
}

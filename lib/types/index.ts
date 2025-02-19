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

export interface Resource {
  id: string
  name: string
  type: 'CPU' | 'Memory' | 'Storage' | 'Network' | 'Other'
  usage: number
  total: number
  unit: string
}

export interface ResourceType {
  id: string
  name: string
  type: 'Equipment' | 'Material' | 'Labor' | 'Power' | 'Other'
  category: 'Production' | 'Construction' | 'Maintenance' | 'Safety'
  usage: number
  total: number
  unit: string
}

export interface Standard {
  id: string
  code: string
  name: string
  category: 'ISO' | 'ASTM' | 'DIN' | 'IEC' | 'ASME' | 'Other'
  description: string
  lastUpdated: Date
  relevantSections: string[]
}

export interface Document {
  id: string
  type: 'Drawing' | 'Simulation' | 'Report' | 'Specification' | 'Manual'
  title: string
  fileUrl: string
  version: string
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'review' | 'approved' | 'obsolete'
}

export interface Issue {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'Production' | 'Construction' | 'Maintenance' | 'Safety'
  location: string
  createdAt: Date
  updatedAt: Date
  resources: ResourceType[]
  standards: Standard[]
  documents: Document[]
}

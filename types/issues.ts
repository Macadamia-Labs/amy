export interface Issue {
  id: string
  title: string
  description: string
  proposedSolution?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: string
  location?: string
  createdAt?: Date
  updatedAt?: Date
  severity?: string
  resources: Array<{
    id: string
    title: string
    description: string
  }>
  affectedWorkflows?: Array<{
    id: string
    title: string
    status: 'draft' | 'active' | 'completed' | 'failed' | 'running'
  }>
  comments?: Array<{
    id: string
    content: string
    author: {
      name: string
    }
    createdAt: Date
  }>
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
}

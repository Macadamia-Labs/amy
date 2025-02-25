export interface Issue {
  id: string
  title: string
  description: string
  proposedSolution?: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved'
  category: string
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
    createdAt: string
  }>
}

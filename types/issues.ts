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
  comments?: Array<{
    id: string
    content: string
    author: {
      name: string
    }
    createdAt: string
  }>
}

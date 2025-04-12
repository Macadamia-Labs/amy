import { hybridSearch } from '@/lib/actions/retrieval'
import { tool } from 'ai'
import { z } from 'zod'

const retrieveSchema = z.object({
  query: z.string().describe('The search query to find relevant documentation')
})

interface DocumentMatch {
  id: string
  content: string
  url: string
  metadata: object
  similarity_score: number
}

export const retrieveTool = tool({
  description:
    'Retrieve information from the knowledge base. Use this tool to find relevant sources based on a query.',
  parameters: retrieveSchema,
  execute: async ({ query }) => {
    console.log('Retrieving documentation for:', query)
    const matches = await hybridSearch(query)
    if (!matches || matches.length === 0) {
      return []
    }

    return matches.map((match: DocumentMatch) => ({
      id: match.id,
      content: match.content,
      url: match.url,
      metadata: match.metadata,
      similarity_score: match.similarity_score
    }))
  }
})

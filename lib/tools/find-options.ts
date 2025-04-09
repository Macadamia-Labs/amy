import { tool } from 'ai'
import { z } from 'zod'

export const findOptionsTool = tool({
  description:
    'Based on a query, find options for the query. When this tool is called, no need for sending a messsage with it.',
  parameters: z.object({
    query: z.string().describe('The query to find options for')
  }),
  execute: async ({ query }) => {
    console.log('Finding options for:', query)
    await new Promise(resolve => setTimeout(resolve, 10000))
    return [
      {
        id: '1',
        name: 'Option 1',
        description: 'Option 1 description'
      },
      {
        id: '2',
        name: 'Option 2',
        description: 'Option 2 description'
      }
    ]
  }
})

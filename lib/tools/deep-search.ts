import { DataStreamWriter, tool } from 'ai'
import { z } from 'zod'
import { inngest } from '../inngest/client'

export const deepSearchTool = (dataStream?: DataStreamWriter) =>
  tool({
    description:
      'Based on a query, find options for the query. When this tool is called, no need for sending a messsage with it.',
    parameters: z.object({
      query: z.string().describe('The query to find options for'),
      resource_ids: z
        .array(z.string())
        .describe('The resource ids to search in')
    }),
    execute: async ({ query, resource_ids }, { abortSignal }) => {
      console.log('Performing a deep search for:', query)
      console.log('Resource ids:', resource_ids)
      console.log('dataStream', dataStream)
      // if (dataStream) {
      //   dataStream.writeMessageAnnotation({
      //     type: 'tool-status',
      //     toolCallId: 'deep-search', // Assuming a static ID for demonstration
      //     status: 'in-progress'
      //   })
      // }
      await inngest.send({
        name: 'deep-search.start',
        data: {
          query,
          resource_ids,
          dataStream
        },
        abortSignal
      })
      // if (dataStream) {
      //   dataStream.writeMessageAnnotation({
      //     type: 'tool-status',
      //     toolCallId: 'deep-search', // Assuming a static ID for demonstration
      //     status: 'completed'
      //   })
      // }
      return 'Deep search started'
    }
  })

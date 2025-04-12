import { tool } from 'ai'
import { z } from 'zod'
import { getResource } from '../actions/resources'

export const loadResourceTool = tool({
  description:
    'If more information is needed from a resource, use this tool to load the full content of the resource again base on the resource_id.',
  parameters: z.object({
    resource_id: z.string().describe('The ID of the resource to load')
  }),
  execute: async ({ resource_id }) => {
    try {
      console.log('Loading resource:', resource_id)
      const resource = await getResource(resource_id)
      return resource.content_as_text
    } catch (error) {
      console.error('Error analyzing image:', error)
      throw new Error(
        `Failed to analyze image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
})

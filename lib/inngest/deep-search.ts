import { getResourcesByIds } from '@/lib/actions/resources'
import { inngest } from './client'

import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'

async function deepSearch(query: string, resource_ids: string[]) {
  // Get the resources
  const resources = await getResourcesByIds(resource_ids)

  if (resources.length === 0) {
    return { summary: 'No resources found' }
  }

  const resources_context = resources
    .map(resource => resource.content_as_text)
    .join('\n')

  console.log('resources_context', resources_context)

  if (resources_context.length === 0) {
    return { summary: 'No resources found' }
  }

  // First step: Generate subquestions
  const {
    object: { subquestions }
  } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      subquestions: z.array(z.string())
    }),
    prompt: `Generate subquestions for: ${query}. These should be specific questions that are relevant to answering the query.`
  })

  console.log('subquestions', subquestions)

  // Step 2: Generate answers to subquestions in parallel
  const answers = await Promise.all(
    subquestions.map(async subquestion => {
      const { object: answer } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          reasoning: z.string(),
          answer: z.string()
        }),
        prompt: `Answer this question: ${subquestion}. Based on this context: ${resources_context}. `
      })
      return { subquestion, answer }
    })
  )

  console.log('answers', answers)

  // Step 3: based on the answers
  const { text: answer } = await generateText({
    model: openai('gpt-4o'),
    prompt: `Based on these answers: ${answers}. Generate an answer to the query: ${query}. `
  })

  return { answer }
}

export const deepSearchInngest = inngest.createFunction(
  {
    name: 'Deep Search',
    id: 'deep-search',
    timeouts: {
      finish: '5m' // 5 minute execution timeout
    }
  },
  { event: 'deep-search.start' },
  async ({ event }) => {
    const { query, resource_ids, dataStream } = event.data
    console.log('dataStream', dataStream)
    try {
      dataStream.writeMessageAnnotation({
        type: 'tool-status',
        toolCallId: 'deep-search', // Assuming a static ID for demonstration
        status: 'in-progress'
      })
      const result = await deepSearch(query, resource_ids)
      dataStream.writeMessageAnnotation({
        type: 'tool-status',
        toolCallId: 'deep-search', // Assuming a static ID for demonstration
        status: 'completed'
      })
      return { success: true, result }
    } catch (error: any) {
      console.error('[deep-search] Error processing file:', error)
      return { success: false, error: 'Failed to process file' }
    }
  }
)

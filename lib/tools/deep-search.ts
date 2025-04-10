import { openai } from '@ai-sdk/openai'
import { DataStreamWriter, generateObject, generateText, tool } from 'ai'
import { z } from 'zod'
import { getResourcesByIds } from '../actions/resources'
// import { inngest } from '../inngest/client'

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
    execute: async ({ query, resource_ids }) => {
      const { answer } = await deepSearch(query, resource_ids, dataStream)
      return `Answer:  ${answer}`
    }
  })

export async function deepSearch(
  query: string,
  resource_ids: string[],
  dataStream?: DataStreamWriter
) {
  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-status',
      toolCallId: 'deep-search',
      status: 'in-progress'
    })
  }
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

  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-event',
      toolCallId: 'deep-search',
      event: 'resources-context-generated'
    })
  }

  // First step: Generate subquestions
  const {
    object: { subquestions }
  } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      subquestions: z.array(z.string())
    }),
    prompt: `Generate (max 5)subquestions for: ${query}. These should be specific questions that are relevant to answering the query in this context: ${resources_context}.`
  })

  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-event',
      toolCallId: 'deep-search',
      event: 'subquestions-generated',
      data: {
        subquestions
      }
    })
  }

  // Step 2: Generate answers to subquestions in parallel
  const answers = await Promise.all(
    subquestions.map(async subquestion => {
      const {
        object: { reasoning, answer }
      } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          reasoning: z.string(),
          answer: z.string()
        }),
        prompt: `Answer this question: ${subquestion}. Based on this context: ${resources_context}. `
      })
      return { subquestion, reasoning, answer }
    })
  )

  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-event',
      toolCallId: 'deep-search',
      event: 'subquestions-answers-generated',
      data: {
        answers
      }
    })
  }

  // Step 3: based on the answers
  const { text: answer } = await generateText({
    model: openai('gpt-4o'),
    prompt: `Based on these answers: ${JSON.stringify(
      answers
    )}. Generate an answer to the query: ${query}. `
  })

  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-event',
      toolCallId: 'deep-search',
      event: 'answer-generated',
      data: {
        answer
      }
    })
  }
  return { answer }
}

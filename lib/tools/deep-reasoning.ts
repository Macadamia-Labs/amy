import { google } from '@ai-sdk/google'
import { DataStreamWriter, generateObject, tool } from 'ai'
import { z } from 'zod'
// import { inngest } from '../inngest/client'

export const deepReasoningTool = (
  dataStream?: DataStreamWriter,
  context?: string
) =>
  tool({
    description:
      'This tool calls a smarter reasoning model. Use it for answering complex questions that require reasoning over a given context.',
    parameters: z.object({
      query: z.string().describe('The query to find options for'),
      reasoningEffort: z
        .enum(['low', 'medium', 'high'])
        .describe('The effort of the reasoning, default is low.')
    }),
    execute: async ({ query, reasoningEffort }) => {
      const { answer, reasoning } = await deepReasoning(
        query,
        reasoningEffort,
        dataStream,
        context
      )
      return `Answer:  ${answer} Reasoning: ${reasoning}`
    }
  })

export async function deepReasoning(
  query: string,
  reasoningEffort: 'low' | 'medium' | 'high' = 'low',
  dataStream?: DataStreamWriter,
  context?: string
) {
  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-status',
      toolCallId: 'deep-reasoning',
      status: 'in-progress'
    })
  }
  // Step 3: based on the answers
  const {
    object: { reasoning, answer }
  } = await generateObject({
    model: google('gemini-2.5-pro-exp-03-25'),
    schema: z.object({
      reasoning: z.string().describe('A concise reasoning for the answer'),
      answer: z.string().describe('The answer to the query')
    }),
    prompt: `Based on this context: ${context}. Generate an answer to the query: ${query}. `,
    providerOptions: {
      openai: { reasoningEffort: reasoningEffort }
    }
  })

  if (dataStream) {
    dataStream.writeMessageAnnotation({
      type: 'tool-event',
      toolCallId: 'deep-reasoning',
      event: 'answer-generated',
      data: {
        answer,
        reasoning
      }
    })
  }
  return { reasoning, answer }
}

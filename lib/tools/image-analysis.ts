import { google } from '@ai-sdk/google'
import { generateText, tool } from 'ai'
import { initLogger } from 'braintrust'
import { z } from 'zod'

interface ImageAnalysisResponse {
  description: string
  analysis: string
}

const logger = initLogger({
  projectName: 'image-analysis-gemini',
  apiKey: process.env.BRAINTRUST_API_KEY
})

export const imageAnalysisTool = tool({
  description:
    'If more information is needed from an image, use this tool to query the image again.',
  parameters: z.object({
    imageUrl: z.string().describe('The URL of the image to analyze'),
    question: z.string().describe('The question to ask about the image')
  }),
  execute: async ({ imageUrl, question }) => {
    try {
      console.log('Analyzing image:', imageUrl)
      
      // Wrap the model with Braintrust logger
      const model = google('gemini-2.0-flash-001')

      const result = await generateText({
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: question
              },
              {
                type: 'file',
                data: imageUrl,
                mimeType: 'image/jpeg' // Adjust based on actual image type
              }
            ]
          }
        ],
        experimental_telemetry: {
          isEnabled: true,
          metadata: {
            tool: 'imageAnalysis',
            imageUrl,
            question
          }
        }
      })

      // Log the completion with Braintrust
      logger.log({
        input: { imageUrl, question },
        output: result.text,
        metadata: {
          modelName: 'gemini-2.0-flash-001',
          completionTokens: result.usage?.completionTokens,
          promptTokens: result.usage?.promptTokens,
          totalTokens: result.usage?.totalTokens
        }
      })

      return {
        description: 'Image analysis completed successfully',
        analysis: result.text
      } as ImageAnalysisResponse
    } catch (error) {
      console.error('Error analyzing image:', error)
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
})
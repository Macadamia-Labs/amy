import { google } from '@ai-sdk/google'
import { generateText, tool } from 'ai'
import { z } from 'zod'

interface ImageAnalysisResponse {
  description: string
  analysis: string
}

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
      
      const result = await generateText({
        model: google('gemini-2.0-flash-001'),
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
        ]
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
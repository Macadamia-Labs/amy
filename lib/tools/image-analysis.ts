import { google } from '@ai-sdk/google'
import { generateText, tool } from 'ai'
import { initLogger } from 'braintrust'
import { z } from 'zod'

export interface ImageAnalysisResponse {
  description: string
  analysis: string
}

// Initialize the Braintrust logger
const logger = initLogger({
  projectName: "image-analysis-gemini",
  apiKey: process.env.BRAINTRUST_API_KEY,
});

// Create the Gemini model directly without Braintrust wrapping
const geminiModel = google('gemini-2.0-flash');

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
      
      // Use generateText with the direct model
      const result = await generateText({
        model: geminiModel,
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
      });

      // Log the result to Braintrust separately
      logger.log({
        input: { imageUrl, question },
        output: result.text,
        metadata: { model: 'gemini-2.0-flash' }
      });

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
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    console.log('Processing image:', imageUrl)

    const { object, usage } = await generateObject({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content:
            'You are a vision analysis assistant. Analyze the image and provide a concise description, relevant tags, and list of detected objects.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe the objects in this image' },
            { type: 'image', image: imageUrl } // or image buffer
          ]
        }
      ],
      schema: z.object({
        description: z
          .string()
          .describe('A one-liner description of the image'),
        content: z.string().describe('A detailed description of the image'),
        tags: z.array(z.string()).describe('A list of tags for the image')
      })
    })

    console.log('Usage:', JSON.stringify(usage, null, 2))

    if (!object) {
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      )
    }

    console.log('Processed image:', object)

    return NextResponse.json({ object })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

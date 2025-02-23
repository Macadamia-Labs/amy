import fetch from 'node-fetch'
import { ProcessedImageResult } from './types'

export async function processImage(
  fileURL: string,
  userId: string
): Promise<ProcessedImageResult> {
  const processingEndpoint = `${process.env.IMAGE_PROCESSING_URL}/api/process-image`
  const response = await fetch(processingEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      userId,
      imageUrl: fileURL
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Image processing service error: ${response.statusText} (${response.status})\nDetails: ${errorText}`
    )
  }

  const { object } = (await response.json()) as {
    object: ProcessedImageResult
  }

  return object
}

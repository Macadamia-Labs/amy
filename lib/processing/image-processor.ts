import fetch from 'node-fetch'
import { ProcessedImageResult } from './types'

export async function processImage(
  fileURL: string,
  userId: string
): Promise<ProcessedImageResult> {
  console.log('[process-image] Processing image with file URL:', fileURL)
  const processingEndpoint = `${process.env.IMAGE_PROCESSING_URL}/process-image`
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
  const data = await response.json()
  console.log('[process-image] Response:', data)

  return data as ProcessedImageResult
}

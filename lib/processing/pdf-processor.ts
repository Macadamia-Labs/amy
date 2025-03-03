import fetch from 'node-fetch'
import { createServiceRoleClient } from '../supabase/service-role'
import { ProcessedPDFResult, ProcessingServiceResponse } from './types'

export async function processPDF(
  resourceId: string,
  fileURL: string,
  userId: string
): Promise<ProcessedPDFResult> {
  const supabase = createServiceRoleClient()
  // Use config for URL with fallback
  const processingUrl =
    process.env.PDF_PROCESSING_URL || config.pdfProcessingService.url
  const processingEndpoint = `${processingUrl}/convert-pdf`

  console.log('[process-pdf] Processing PDF:', fileURL)
  console.log('[process-pdf] User ID:', userId)

  // Add retry logic
  const maxRetries = 3
  let retryCount = 0
  let lastError: Error | null = null

  while (retryCount < maxRetries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minute timeout (was 30 seconds)

      const response = await fetch(processingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          resourceId,
          userId,
          pdfUrl: fileURL
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `PDF processing service error: ${response.statusText} (${response.status})\nDetails: ${errorText}`
        )
      }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `PDF processing service error: ${response.statusText} (${response.status})\nDetails: ${errorText}`
    )
  }

  const result = (await response.json()) as ProcessingServiceResponse

      return {
        imageUrl: publicUrl,
        filePaths: result.pages,
        description: result.description,
        outline: result.outline || []
      }
    } catch (error: any) {
      lastError = error
      retryCount++

      // Log retry attempt
      console.log(
        `[process-pdf] Retry attempt ${retryCount}/${maxRetries} after error:`,
        error.message
      )

      // If it's not the last retry, wait before trying again
      if (retryCount < maxRetries) {
        // Exponential backoff: 2^retry * 1000ms (2s, 4s, 8s)
        const backoffTime = Math.pow(2, retryCount) * 1000
        await delay(backoffTime)
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  if (lastError) {
    throw new Error(
      `PDF processing failed after ${maxRetries} attempts: ${lastError.message}`
    )
  }

  // This should never happen, but TypeScript requires a return
  throw new Error('Unexpected error in PDF processing')
}

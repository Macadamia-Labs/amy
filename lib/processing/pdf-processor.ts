import fetch from 'node-fetch'
import { config } from '../config'
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

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minute timeout

  try {
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

    const result = (await response.json()) as ProcessingServiceResponse

    // Get public URL for the first page
    const {
      data: { publicUrl }
    } = supabase.storage.from('resources').getPublicUrl(result.pages[0])

    return {
      imageUrl: publicUrl,
      filePaths: result.pages,
      description: result.description,
      outline: result.outline || []
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    throw new Error(`PDF processing failed: ${error.message}`)
  }
}

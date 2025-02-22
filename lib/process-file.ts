import fetch from 'node-fetch'
import { config } from './config'
import { createServiceRoleClient } from './supabase/service-role'
import { generateUUID } from './utils/helpers'

interface ProcessingServiceResponse {
  pages: string[] // base64 encoded PNG data
}

export interface ProcessedResult {
  imageUrl: string
  userId: string
  filePaths?: string[]
}

export async function processFileFromUrl(
  fileUrl: string,
  userId: string
): Promise<ProcessedResult> {
  const supabase = createServiceRoleClient()
  try {
    console.log('Processing file from URL:', fileUrl)
    
    // Validate URL
    if (!fileUrl) {
      throw new Error('File URL is required')
    }

    // Add URL validation
    try {
      new URL(fileUrl)
    } catch (e) {
      throw new Error(`Invalid file URL: ${fileUrl}`)
    }
    
    // Send the PDF URL to the processing service
    const processingResponse = await fetch(`${config.pdfProcessingService.url}${config.pdfProcessingService.endpoints.convertPdfToPng}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pdfUrl: fileUrl })
    })

    if (!processingResponse.ok) {
      throw new Error(
        `PDF processing service error: ${processingResponse.statusText} (${processingResponse.status})`
      )
    }

    const result = await processingResponse.json() as ProcessingServiceResponse
    console.log('Processing service response status:', processingResponse.status)
    console.log('First few characters of base64:', result.pages[0].substring(0, 50))
    console.log('Base64 length for page:', result.pages[0].length)
    const pageBuffers = result.pages.map((page: string) => Buffer.from(page, 'base64'))
    console.log(`Received ${pageBuffers.length} pages from processing service`)
    
    const filePaths: string[] = []
    
    // Upload each page
    for (let i = 0; i < pageBuffers.length; i++) {
      const pngBuffer = pageBuffers[i]
      console.log(`Processing page ${i + 1}, size: ${pngBuffer.length} bytes`)
      
      // Generate unique filename with UUID
      const filename = `${userId}/${generateUUID()}.png`
      console.log('Generated filename:', filename)
      
      // Upload directly to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filename, pngBuffer, {
          contentType: 'image/png',
          cacheControl: '3600'
        })

      if (uploadError) {
        throw new Error(`Upload failed for page ${i + 1}: ${uploadError.message}`)
      }
      console.log(`Page ${i + 1} uploaded successfully to storage`)
      
      filePaths.push(filename)
      console.log(`File path for page ${i + 1}:`, filename)
    }

    // Get public URL for the first page to return as imageUrl
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(filePaths[0])

    return {
      imageUrl: publicUrl, // Public URL only for the first page
      userId,
      filePaths // Store just the file paths for all pages
    }
  } catch (error) {
    console.error('Error processing file:', error)
    throw error
  }
}

import fetch from 'node-fetch'
import { config } from './config'
import { createServiceRoleClient } from './supabase/service-role'

interface ProcessingServiceResponse {
  pages: string[] // Now just receives file paths
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

    // Extract the file path from the signed URL
    const urlObj = new URL(fileUrl)
    const filePath = urlObj.pathname.split('/object/sign/resources/')[1]?.split('?')[0]
    
    if (!filePath) {
      throw new Error('Could not extract file path from URL')
    }

    // Get a fresh signed URL with longer expiration
    const { data, error: signError } = await supabase.storage
      .from('resources')
      .createSignedUrl(filePath, 3600) // 1 hour expiration

    if (signError || !data?.signedUrl) {
      throw new Error(`Failed to create signed URL: ${signError?.message || 'No URL returned'}`)
    }
    
    // Send the PDF URL to the processing service
    console.log('Sending to processing service:', config.pdfProcessingService.url)
    const processingResponse = await fetch(`${config.pdfProcessingService.url}/convert-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        pdfUrl: data.signedUrl,
        userId: userId
      })
    })

    if (!processingResponse.ok) {
      const errorText = await processingResponse.text()
      throw new Error(
        `PDF processing service error: ${processingResponse.statusText} (${processingResponse.status})\nDetails: ${errorText}`
      )
    }

    const result = await processingResponse.json() as ProcessingServiceResponse
    console.log('Processing service response status:', processingResponse.status)
    
    if (!result.pages?.length) {
      throw new Error('No pages returned from processing service')
    }
    
    // Get public URL for the first page
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(result.pages[0])

    return {
      imageUrl: publicUrl,
      userId,
      filePaths: result.pages
    }
  } catch (error) {
    console.error('Error processing file:', error)
    throw error
  }
}

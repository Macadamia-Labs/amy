import fetch from 'node-fetch'
import sharp from 'sharp'
import { createClient } from './supabase/server'

export interface ProcessedResult {
  imageUrl: string // Single image URL
}

async function convertToPng(buffer: Buffer): Promise<Buffer> {
  // Add logging for image conversion
  console.log('Converting image to PNG...')
  const metadata = await sharp(buffer).metadata()
  console.log('Original image metadata:', metadata)
  
  return await sharp(buffer)
    .png()
    .toBuffer()
}

export async function processFileFromUrl(
  fileUrl: string
): Promise<ProcessedResult> {
  const supabase = await createClient()
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
    
    // Fetch the file with more detailed error handling
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.statusText} (${response.status}). URL: ${fileUrl}`
      )
    }
    
    // Check content type
    const contentType = response.headers.get('content-type')
    console.log('File content type:', contentType)
    
    console.log('File fetched successfully')
    const fileBuffer = await response.arrayBuffer()
    
    // Add size check
    if (fileBuffer.byteLength === 0) {
      throw new Error('Received empty file buffer')
    }
    console.log('Received file size:', fileBuffer.byteLength, 'bytes')
    
    // Convert to PNG
    const pngBuffer = await convertToPng(Buffer.from(fileBuffer))
    console.log('Converted to PNG, size:', pngBuffer.length, 'bytes')
    
    // Generate unique filename
    const filename = `${Date.now()}.png`
    console.log('Generated filename:', filename)
    
    // Upload directly to storage bucket
    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filename, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }
    console.log('File uploaded successfully to storage')

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(filename)
    
    console.log('Generated public URL:', publicUrl)

    return {
      imageUrl: publicUrl
    }
  } catch (error) {
    console.error('Error processing file:', {
      error: error instanceof Error ? error.message : error,
      fileUrl,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}

import { createServiceRoleClient } from '../supabase/service-role'
import { Resource } from '../types/database'
import { processDocument } from './document-processor'
import { processImage } from './image-processor'
import { processPDF } from './pdf-processor'
import { ProcessedResource } from './types'

export async function processResource(
  resource: Resource,
  userId: string
): Promise<any> {
  const supabase = createServiceRoleClient()
  try {
    console.log(
      '\n------\n',
      'Processing resource with ID:',
      resource.id,
      '\n------\n'
    )

    if (!resource) {
      throw new Error('Resource is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('[process-resource] Resource fetched from DB:', resource)

    // Get file extension and validate supported types
    const fileExtension =
      resource.file_path.split('.').pop()?.toLowerCase() || ''
    const supportedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']

    if (!supportedTypes.includes(fileExtension)) {
      throw new Error(
        `Unsupported file type: ${fileExtension}. Supported types are: ${supportedTypes.join(
          ', '
        )}`
      )
    }

    // Get signed URL for the file
    const signedUrlResponse = await supabase.storage
      .from('resources')
      .createSignedUrl(resource.file_path, 60 * 10)

    if (!signedUrlResponse.data) {
      throw new Error('Failed to create signed URL')
    }

    const fileURL = signedUrlResponse.data.signedUrl
    let result: ProcessedResource

    // Process based on file type
    switch (fileExtension) {
      case 'pdf':
        result = await processPDF(resource.id, fileURL, userId)
        break
      case 'doc':
      case 'docx':
        result = await processDocument(fileURL, userId)
        break
      case 'jpg':
      case 'jpeg':
      case 'png':
        result = await processImage(fileURL, userId)
        break
      default:
        throw new Error(`Unhandled file type: ${fileExtension}`)
    }

    console.log('[process-resource] Processed resource:', result)

    return result
  } catch (error) {
    console.error('Error processing file:', error)
    throw error
  }
}

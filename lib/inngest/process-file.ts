import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { generateUUID } from '@/lib/utils/helpers'
import { processFileFromUrl } from '../process-file'
import { inngest } from './client'

export const processFile = inngest.createFunction(
  { name: 'Process Uploaded File', id: 'process-file' },
  { event: 'file.uploaded' },
  async ({ event }) => {
    const { fileUrl, resourceId, userId, title, category } = event.data
    const supabase = createServiceRoleClient()

    try {
      // Process the file and get the results
      const result = await processFileFromUrl(fileUrl, userId)
      
      // Ensure we have file paths
      if (!result.filePaths || result.filePaths.length === 0) {
        throw new Error('No file paths returned from processing')
      }

      console.log('Creating resource entry and related pages')
      
      // Get public URL for the first page to use as preview
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(result.filePaths[0])

      // Update the main resource entry
      const { error: updateError } = await supabase
        .from('resources')
        .update({
          file_path: result.filePaths[0], // Store first page as preview
          processed: true,
          processing_result: { 
            publicUrl,
            totalPages: result.filePaths.length,
            fileType: 'pdf'
          },
          processing_completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', resourceId)

      if (updateError) {
        throw updateError
      }

      // Create entries in pdf_pages table
      const pageEntries = result.filePaths.map((filePath, index) => {
        const { data: { publicUrl: pageUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath)

        return {
          id: generateUUID(),
          resource_id: resourceId,
          page_number: index + 1,
          file_path: filePath,
          public_url: pageUrl
        }
      })

      const { error: pagesError } = await supabase
        .from('pdf_pages')
        .insert(pageEntries)

      if (pagesError) {
        throw new Error(`Failed to create page entries: ${pagesError.message}`)
      }

      console.log('Successfully created resource and related entries')
      return { success: true, result }
    } catch (error: any) {
      console.error('Error processing file:', error)

      // Update the resource with error status
      await supabase
        .from('resources')
        .update({
          processed: false,
          processing_error: error.message || 'Failed to process file',
          status: 'error'
        })
        .eq('id', resourceId)

      return { success: false, error: 'Failed to process file' }
    }
  }
)

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

      console.log('Creating/updating resource entries for each page')
      
      // Create/update entries for each page
      for (let i = 0; i < result.filePaths.length; i++) {
        const filePath = result.filePaths[i]
        const isFirstPage = i === 0
        
        // Get public URL for this page
        const { data: { publicUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath)

        if (isFirstPage) {
          // Update the existing resource for the first page
          const { error: updateError } = await supabase
            .from('resources')
            .update({
              file_path: filePath,
              processed: true,
              processing_result: { publicUrl, originalId: resourceId, pageNumber: 1, totalPages: result.filePaths.length },
              processing_completed_at: new Date().toISOString(),
              status: 'completed'
            })
            .eq('id', resourceId)

          if (updateError) {
            throw updateError
          }
        } else {
          // Create new resources for additional pages with new UUIDs
          const pageId = generateUUID()
          const { error: insertError } = await supabase
            .from('resources')
            .insert({
              id: pageId,
              title: `${title} - Page ${i + 1}`,
              description: `Page ${i + 1} of ${title}`,
              category,
              file_path: filePath,
              user_id: userId,
              processed: true,
              processing_result: { publicUrl, originalId: resourceId, pageNumber: i + 1, totalPages: result.filePaths.length },
              processing_completed_at: new Date().toISOString(),
              status: 'completed'
            })

          if (insertError) {
            throw insertError
          }
        }
      }

      console.log('Successfully created/updated resource entries for all pages')
      return { success: true, result }
    } catch (error: any) {
      console.error('Error processing file:', error)

      // Update only the original resource with error status
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

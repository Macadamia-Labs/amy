// src/inngest/functions/processFile.ts
import { createClient } from '@/lib/supabase/server'
import { processFileFromUrl } from '../process-file'
import { inngest } from './client'

export const processFile = inngest.createFunction(
  { name: 'Process Uploaded File', id: 'process-file' },
  { event: 'file.uploaded' },
  async ({ event }) => {
    const { fileUrl, resourceId } = event.data
    const supabase = await createClient()

    try {
      // Process the file and get the results
      const result = await processFileFromUrl(fileUrl)

      // Update the resource status in the database
      const { error: updateError } = await supabase
        .from('resources')
        .update({
          processed: true,
          processing_result: result,
          processing_completed_at: new Date().toISOString(),
          processing_status: 'completed'
        })
        .eq('id', resourceId)

      if (updateError) {
        throw updateError
      }

      return { success: true, result }
    } catch (error) {
      console.error('Error processing file:', error)

      // Update the resource with error status
      await supabase
        .from('resources')
        .update({
          processed: false,
          processing_error: error.message || 'Failed to process file',
          processing_status: 'error'
        })
        .eq('id', resourceId)

      return { success: false, error: 'Failed to process file' }
    }
  }
)

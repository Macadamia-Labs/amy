import {
  handleResourceError,
  handleResourceSuccess
} from '@/lib/actions/resources'
import { processResource } from '../processing/process-resource'
import { inngest } from './client'

export const processFile = inngest.createFunction(
  { name: 'Process Uploaded File', id: 'process-file' },
  { event: 'file.uploaded' },
  async ({ event }) => {
    const { resource, userId } = event.data

    try {
      // Process the file and get the results
      const result = await processResource(resource, userId)

      // Update the resource
      await handleResourceSuccess(resource.id, result)

      console.log('Successfully created resource and related entries')
      return { success: true, result }
    } catch (error: any) {
      console.error('Error processing file:', error)

      // Update the resource with error status
      await handleResourceError(resource.id, error)

      return { success: false, error: 'Failed to process file' }
    }
  }
)

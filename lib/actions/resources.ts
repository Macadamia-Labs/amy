import { generateUUID } from '@/lib/utils/helpers'
import { ProcessedResource } from '../processing/types'
import { createServiceRoleClient } from '../supabase/service-role'

export const handleResourceSuccess = async (
  resourceId: string,
  result: ProcessedResource
) => {
  const supabase = await createServiceRoleClient()
  console.log('[handleResourceSuccess] Saving result:', result)
  const { error: updateError } = await supabase
    .from('resources')
    .update({
      title: result.title,
      description: result.description,
      content: result.content,
      processed: true,
      processing_result: result,
      processing_completed_at: new Date().toISOString(),
      status: 'completed'
    })
    .eq('id', resourceId)

  if (updateError) {
    throw updateError
  }
}

export const handleResourceProcessing = async (resourceId: string) => {
  const supabase = await createServiceRoleClient()
  const { error: updateError } = await supabase
    .from('resources')
    .update({ status: 'processing' })
    .eq('id', resourceId)

  if (updateError) {
    throw updateError
  }
}

export const handleResourceError = async (resourceId: string, error: Error) => {
  const supabase = await createServiceRoleClient()
  const { error: updateError } = await supabase
    .from('resources')
    .update({
      processed: false,
      processing_error: error.message || 'Failed to process file',
      status: 'error'
    })
    .eq('id', resourceId)

  if (updateError) {
    throw updateError
  }
}

export const createPdfPages = async (
  resourceId: string,
  filePaths: string[]
) => {
  const supabase = await createServiceRoleClient()
  const pageEntries = filePaths.map((filePath, index) => {
    const {
      data: { publicUrl: pageUrl }
    } = supabase.storage.from('resources').getPublicUrl(filePath)

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
}

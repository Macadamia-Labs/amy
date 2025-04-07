'use server'
import { createClient } from '@/lib/supabase/server'
import { generateUUID } from '@/lib/utils/helpers'
import { revalidatePath as nextRevalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ProcessedResource } from '../processing/types'
import { createServiceRoleClient } from '../supabase/service-role'
import { Resource, ResourceStatus } from '../types'

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

export const setResourcesStatus = async (
  resource_id: string,
  status: ResourceStatus
) => {
  const supabase = await createServiceRoleClient()
  const { error: updateError } = await supabase
    .from('resources')
    .update({ status })
    .eq('id', resource_id)

  if (updateError) {
    throw updateError
  }
}

export async function getResources() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('You must be logged in to view resources')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

export async function deleteResources(ids: string[]): Promise<void> {
  const supabase = await createClient()
  console.log('[deleteResources] Starting deletion for ids:', ids)

  try {
    // First get the file paths
    const { data: resources, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .in('id', ids)

    if (fetchError) {
      console.error('[deleteResources] Error fetching file paths:', fetchError)
      throw fetchError
    }

    // Delete files from storage if they exist
    const filePaths =
      resources?.filter(r => r.file_path).map(r => r.file_path) || []
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('resources')
        .remove(filePaths)

      if (storageError) {
        console.error(
          '[deleteResources] Error deleting storage files:',
          storageError
        )
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete database records
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .in('id', ids)

    if (deleteError) {
      console.error(
        '[deleteResources] Error deleting database records:',
        deleteError
      )
      throw deleteError
    }

    console.log('[deleteResources] Successfully deleted resources')
    nextRevalidatePath('/(app)/resources')
  } catch (error) {
    console.error('[deleteResources] Error:', error)
    throw error
  }
}

export async function deleteResource(id: string): Promise<void> {
  return deleteResources([id])
}

export async function shareResource(id: string): Promise<string> {
  const supabase = await createClient()
  try {
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!resource?.file_path) throw new Error('Resource not found')

    // Create a signed URL that expires in 24 hours
    const { data, error: signError } = await supabase.storage
      .from('resources')
      .createSignedUrl(resource.file_path, 24 * 60 * 60)

    if (signError) throw signError
    if (!data?.signedUrl) throw new Error('Failed to create share link')

    return data.signedUrl
  } catch (error) {
    console.error('Error sharing resource:', error)
    throw error
  }
}

export async function reprocessResource(id: string): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(
      (cookie: { name: string; value: string }) =>
        `${cookie.name}=${cookie.value}`
    )
    .join('; ')

  const response = await fetch(`${baseUrl}/api/reprocess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    },
    body: JSON.stringify({ resourceId: id })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Error response from /api/reprocess:', error)
    throw new Error(`Failed to reprocess resource: ${response.statusText}`)
  }
}

export async function getSignedFileUrl(id: string): Promise<string> {
  const supabase = await createClient()
  try {
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!resource?.file_path) throw new Error('Resource not found')

    // Create a signed URL that expires in 1 hour
    const { data, error: signError } = await supabase.storage
      .from('resources')
      .createSignedUrl(resource.file_path, 60 * 60) // 1 hour expiration

    if (signError) throw signError
    if (!data?.signedUrl) throw new Error('Failed to create signed URL')

    return data.signedUrl
  } catch (error) {
    console.error('Error getting signed URL:', error)
    throw error
  }
}

export async function getResource(resourceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single()

  if (error) throw error
  return data
}

export async function getResourceEmbeddings(resourceId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('embeddingscooper')
    .select('*')
    .eq('resource_id', resourceId)

  if (error) throw error
  return data
}

export async function getResourceEnriched(resourceId: string) {
  const supabase = await createClient()
  const resource = await getResource(resourceId)
  if (!resource) return null
  const { data } = await supabase.storage
    .from('resources')
    .createSignedUrl(resource.file_path, 60 * 60 * 24 * 30)

  return { ...resource, file_url: data?.signedUrl }
}

export async function updateResource(
  resourceId: string,
  updates: Partial<Resource>
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', resourceId)

  if (error) throw error
  nextRevalidatePath('/(app)/resources')
}

import { SupabaseClient } from '@supabase/supabase-js'
import { inngest } from '../inngest/client'
import { generateUUID } from '../utils/helpers'
import { ZipResource } from './zip-handler'

export interface UploadResource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  file_type: string
  user_id: string
  created_at: string
  status: string
  origin: string
  parent_id?: string | null
}

export async function createResource(
  resource: UploadResource | ZipResource,
  supabase: SupabaseClient
): Promise<void> {
  const { error } = await supabase.from('resources').insert(resource)
  if (error) {
    throw new Error(`Failed to create resource: ${error.message}`)
  }
}

export async function uploadFile(
  file: File,
  userId: string,
  clientId: string | undefined,
  supabase: SupabaseClient
): Promise<UploadResource> {
  const resourceId = clientId || generateUUID()
  const fileExt = file.name?.split('.').pop() || ''
  const filePath = `${userId}/${resourceId}.${fileExt}`

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('resources')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`)
  }

  // Create resource record
  const resource: UploadResource = {
    id: resourceId,
    title: file.name,
    description: '',
    category: 'uncategorized',
    file_path: filePath,
    file_type: fileExt,
    user_id: userId,
    created_at: new Date().toISOString(),
    status: 'pending',
    origin: 'upload'
  }

  await createResource(resource, supabase)
  await triggerFileProcessing(resource, userId)

  return resource
}

export async function triggerFileProcessing(
  resource: UploadResource,
  userId: string
): Promise<void> {
  await inngest.send({
    name: 'file.uploaded',
    data: {
      resource,
      userId
    }
  })
}

export async function handleUploadError(
  filePath: string | undefined,
  supabase: SupabaseClient
): Promise<void> {
  if (filePath) {
    await supabase.storage.from('resources').remove([filePath])
  }
}

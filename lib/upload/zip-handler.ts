import { SupabaseClient } from '@supabase/supabase-js'
import JSZip from 'jszip'
import { inngest } from '../inngest/client'
import { generateUUID } from '../utils/helpers'
import { createResource } from './resource-handler'

export interface ZipResource {
  id: string
  title: string
  file_path: string
  file_type: string
  user_id: string
  created_at: string
  status: string
  origin: string
  parent_id: string | null
}

export async function processZipFile(
  file: File,
  userId: string,
  supabase: SupabaseClient
): Promise<ZipResource[]> {
  const zip = new JSZip()
  const contents = await zip.loadAsync(await file.arrayBuffer())
  const folderResourceId = generateUUID()
  const resources: ZipResource[] = []

  // Create a folder resource
  const folderResource: ZipResource = {
    id: folderResourceId,
    title: file.name.replace('.zip', ''),
    file_path: '',
    file_type: 'folder',
    user_id: userId,
    created_at: new Date().toISOString(),
    status: 'completed',
    origin: 'upload',
    parent_id: null
  }

  // Insert folder resource
  await createResource(folderResource, supabase)
  resources.push(folderResource)

  // Process each file in the zip
  for (const [path, zipEntry] of Object.entries(contents.files)) {
    if (!zipEntry.dir) {
      const fileContent = await zipEntry.async('blob')
      const resourceId = generateUUID()
      const fileExt = path.split('.').pop() || ''
      const fileName = path.split('/').pop() || ''
      const filePath = `${userId}/${resourceId}.${fileExt}`

      try {
        // Upload extracted file to storage
        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, fileContent)

        if (uploadError) {
          console.error('Error uploading extracted file:', uploadError)
          continue
        }

        // Create resource record for the file
        const resource: ZipResource = {
          id: resourceId,
          title: fileName,
          file_path: filePath,
          file_type: fileExt,
          user_id: userId,
          created_at: new Date().toISOString(),
          status: 'pending',
          origin: 'upload',
          parent_id: folderResourceId
        }

        await createResource(resource, supabase)
        resources.push(resource)

        // Trigger processing for supported file types
        if (isSupportedFileType(fileExt)) {
          await triggerFileProcessing(resource, userId)
        }
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error)
        // Continue with other files even if one fails
        continue
      }
    }
  }

  return resources
}

function isSupportedFileType(fileExt: string): boolean {
  const supportedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'heic']
  return supportedTypes.includes(fileExt.toLowerCase())
}

async function triggerFileProcessing(resource: ZipResource, userId: string) {
  await inngest.send({
    name: 'file.uploaded',
    data: {
      resource,
      userId
    }
  })
}

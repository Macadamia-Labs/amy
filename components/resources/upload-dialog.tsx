'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import { Resource, ResourceStatus } from '@/lib/types'
import { UploadResource } from '@/lib/upload/resource-handler'
import { generateUUID } from '@/lib/utils/helpers'
import { PlusIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

interface UploadResponse {
  message: string
  resource?: UploadResource
  resources?: UploadResource[]
}

export function UploadDialog() {
  const { addResources, setUploadStatus } = useResources()
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    let successCount = 0
    const loadingToast = toast.loading(
      `Processing: ${successCount}/${files.length} files uploaded`
    )

    // Prepare all files for upload first
    const uploadItems = files.map(file => {
      const localId = generateUUID()

      // Create initial resource object
      const initialResource: Resource = {
        id: localId,
        title: file.name,
        description:
          file.type === 'application/zip' ? 'Zip archive being processed' : '',
        category: file.type === 'application/zip' ? 'archive' : 'uncategorized',
        file_path: '',
        user_id: '',
        created_at: new Date().toISOString(),
        status: 'pending' as ResourceStatus,
        origin: 'upload',
        file_type: file.type
      }

      return {
        id: localId,
        file,
        resource: initialResource
      }
    })

    // Add all resources to the context at once for better UI update batching
    addResources(uploadItems.map(item => item.resource))

    // Set initial status for all files
    uploadItems.forEach(item => {
      setUploadStatus(item.id, 'processing')
    })

    // Process all files
    const uploadPromises = uploadItems.map(async ({ id, file, resource }) => {
      // Prepare the form data
      const formData = new FormData()
      formData.append('id', id)
      formData.append('file', file)
      formData.append('isZip', String(file.type === 'application/zip'))

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const msg = await response.text()
          console.error('Upload failed:', msg)
          setUploadStatus(id, 'error')
          return false
        } else {
          const data = (await response.json()) as UploadResponse

          // Handle zip file response
          if (file.type === 'application/zip' && data.resources) {
            // Update the folder status
            setUploadStatus(id, 'completed')

            // Add all extracted resources to the context
            const extractedResources = data.resources.filter(r => r.id !== id)
            if (extractedResources.length > 0) {
              // Set initial status for all extracted files before adding them
              extractedResources.forEach(resource => {
                if (resource.status === 'pending') {
                  setUploadStatus(resource.id, 'processing')
                }
              })

              // Add all resources at once for better performance
              addResources(
                extractedResources.map(r => ({
                  ...r,
                  status: r.status as ResourceStatus
                }))
              )
            }
          } else if (data.resource) {
            // Update with server-provided resource data if available
            console.log('Server returned resource data:', data.resource)

            // Set upload status to completed because upload is complete
            setUploadStatus(id, 'completed')

            // Add resource with its current status (could be 'processing' or 'completed')
            addResources([
              {
                ...data.resource,
                status: data.resource.status as ResourceStatus
              }
            ])
            successCount++
          } else {
            successCount++
            // Set upload status to completed because upload is complete
            console.log('Setting upload status to completed for', id)
            setUploadStatus(id, 'completed')

            // Update the resource itself to processing status
            addResources([
              {
                ...resource,
                status: 'processing' as ResourceStatus
              }
            ])
          }

          toast.loading(
            `Processing: ${successCount}/${files.length} files uploaded`,
            { id: loadingToast }
          )
          return true
        }
      } catch (error) {
        console.error('Error uploading:', error)
        setUploadStatus(id, 'error')
        return false
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const finalSuccessCount = results.filter(Boolean).length

      if (finalSuccessCount === files.length) {
        toast.success(
          `Successfully uploaded ${files.length} file${
            files.length > 1 ? 's' : ''
          }`,
          { id: loadingToast }
        )
      } else if (finalSuccessCount > 0) {
        toast.warning(
          `${finalSuccessCount} out of ${files.length} files uploaded successfully`,
          { id: loadingToast }
        )
      } else {
        toast.error('All files failed to upload', { id: loadingToast })
      }
    } catch (error) {
      console.error('Error in batch upload:', error)
      toast.error('Failed to upload files', { id: loadingToast })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,.zip"
        multiple
      />
      <Button disabled={uploading} size="sm">
        <PlusIcon className="size-4" />
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}

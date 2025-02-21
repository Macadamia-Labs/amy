'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import { generateUUID } from '@/lib/utils/helpers'
import * as React from 'react'
import { toast } from 'sonner'

export function UploadDialog() {
  const { addResources, setUploadStatus } = useResources()
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const loadingToast = toast.loading(
      `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`
    )

    // Process all files
    const uploadPromises = files.map(async file => {
      // Generate a local ID for each file
      const localId = generateUUID()

      // Set initial upload status
      setUploadStatus(localId, 'loading')

      // Add to context
      addResources([
        {
          id: localId,
          title: file.name,
          description: '',
          category: 'uncategorized',
          file_path: '',
          user_id: '',
          created_at: new Date().toISOString()
        }
      ])

      // Prepare the form data
      const formData = new FormData()
      formData.append('id', localId)
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const msg = await response.text()
          console.error('Upload failed:', msg)
          toast.error(`Failed to upload ${file.name}`)
          setUploadStatus(localId, 'error')
        } else {
          setUploadStatus(localId, 'success')
        }
      } catch (error) {
        console.error('Error uploading:', error)
        toast.error(`Error uploading ${file.name}`)
        setUploadStatus(localId, 'error')
      }
    })

    try {
      await Promise.all(uploadPromises)
      toast.dismiss(loadingToast)
      toast.success(
        `Successfully uploaded ${files.length} file${
          files.length > 1 ? 's' : ''
        }`,
        {
          description: 'Processing in background...'
        }
      )
    } catch (error) {
      console.error('Error in batch upload:', error)
      toast.dismiss(loadingToast)
      toast.error('Some files failed to upload')
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
        multiple
      />
      <Button disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}

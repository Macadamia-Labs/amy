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
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    // Generate a local ID
    const localId = generateUUID()

    // Show loading toast
    toast.loading('Uploading file...')

    // Set initial upload status
    setUploadStatus(localId, 'loading')

    // Immediately add to context
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
        toast.dismiss()
        toast.error('Upload failed.')
        setUploadStatus(localId, 'error')
      } else {
        toast.dismiss()
        toast.success('File upload initiated. Processing in background.')
        setUploadStatus(localId, 'success')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      toast.dismiss()
      toast.error('Upload error.')
      setUploadStatus(localId, 'error')
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
      />
      <Button disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}

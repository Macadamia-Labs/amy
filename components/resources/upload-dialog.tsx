'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { uploadFile, uploadFolder } from '@/lib/queries/client'
import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export function UploadDialog() {
  const { addResources } = useResources()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    try {
      const files = Array.from(e.target.files)
      const resources = await uploadFolder(files)
      toast.success('Folder uploaded successfully')
      addResources(resources)
    } catch (error) {
      console.error('Error uploading folder:', error)
      if (error instanceof Error) {
        toast.error(`Failed to upload folder: ${error.message}`)
      } else {
        toast.error('Failed to upload folder: An unexpected error occurred')
      }
    } finally {
      setIsUploading(false)
      setUploadDialogOpen(false)
      if (folderInputRef.current) {
        folderInputRef.current.value = ''
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    try {
      const file = e.target.files[0]
      const resource = await uploadFile(file)
      toast.success('File uploaded successfully')
      addResources([resource])
    } catch (error) {
      console.error('Error uploading file:', error)
      if (error instanceof Error) {
        toast.error(`Failed to upload file: ${error.message}`)
      } else {
        toast.error('Failed to upload file: An unexpected error occurred')
      }
    } finally {
      setIsUploading(false)
      setUploadDialogOpen(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Resources
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resources</DialogTitle>
          <DialogDescription>
            Upload individual files or entire folders to add to your resources.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Upload Single File</Label>
            <div className="grid gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">
                Select a single file to upload
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Upload Folder</Label>
            <div className="grid gap-2">
              <input
                ref={folderInputRef}
                type="file"
                // @ts-ignore
                webkitdirectory=""
                directory=""
                multiple
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleFolderUpload}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">
                Select a folder to upload all its contents
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

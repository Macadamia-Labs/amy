'use client'

import {
  Resource,
  useResources
} from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable
} from '@/components/ui/table'
import { categoryIcons } from '@/lib/constants/resources'
import { deleteResource, shareResource } from '@/lib/queries/client'
import { CheckCircleIcon, XCircleIcon } from '@/lib/utils/icons'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Loader2, MoreHorizontal, Share, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function ResourcesTable() {
  const { resources, removeResource, processingResources, uploadStatus } =
    useResources()
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedIds.size === resources.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(resources.map(r => r.id)))
    }
    setLastSelectedId(null)
  }

  const handleCheckboxChange = (
    id: string,
    checked: boolean,
    shiftKey: boolean
  ) => {
    const newSelected = new Set(selectedIds)

    if (shiftKey && lastSelectedId) {
      const lastIndex = resources.findIndex(r => r.id === lastSelectedId)
      const currentIndex = resources.findIndex(r => r.id === id)
      const [start, end] = [lastIndex, currentIndex].sort((a, b) => a - b)

      resources.slice(start, end + 1).forEach(resource => {
        if (checked) {
          newSelected.add(resource.id)
        } else {
          newSelected.delete(resource.id)
        }
      })
    } else {
      if (checked) {
        newSelected.add(id)
      } else {
        newSelected.delete(id)
      }
    }

    setSelectedIds(newSelected)
    setLastSelectedId(id)
  }

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        deleteResource(id)
      )
      await Promise.all(deletePromises)
      selectedIds.forEach(id => removeResource(id))
      setSelectedIds(new Set())
      toast.success('Selected resources deleted successfully')
    } catch (error) {
      console.error('Error deleting resources:', error)
      toast.error('Failed to delete some resources')
    }
  }

  const handleBulkShare = async () => {
    try {
      const sharePromises = Array.from(selectedIds).map(async id => {
        const url = await shareResource(id)
        return url
      })
      const urls = await Promise.all(sharePromises)
      await navigator.clipboard.writeText(urls.join('\n'))
      toast.success('Share links copied to clipboard')
    } catch (error) {
      console.error('Error sharing resources:', error)
      toast.error('Failed to share some resources')
    }
  }

  const getStatusIcon = (resource: Resource) => {
    const IconComponent =
      categoryIcons[resource.category as keyof typeof categoryIcons]

    const currentUploadStatus = uploadStatus.get(resource.id)

    if (currentUploadStatus === 'loading') {
      return <Loader2 className="size-6 text-blue-500 animate-spin" />
    } else if (currentUploadStatus === 'error' || resource.status === 'error') {
      return <XCircleIcon className="size-6 text-red-500" />
    } else if (
      currentUploadStatus === 'success' ||
      resource.status === 'completed'
    ) {
      return <CheckCircleIcon className="size-6 text-green-500" />
    } else if (IconComponent) {
      return <IconComponent className="size-6 text-muted-foreground" />
    }

    return (
      <div className="size-5 border-2 border-dashed border-muted-foreground rounded-full" />
    )
  }

  const handleShare = async (id: string) => {
    try {
      const shareUrl = await shareResource(id)
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard')
    } catch (error) {
      console.error('Error sharing resource:', error)
      toast.error('Failed to share resource')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id)
      removeResource(id)
      toast.success('Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">All Resources</h2>
          <p className="text-muted-foreground">
            Access engineering documents, standards, and project communications
          </p>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkShare}>
              <Share className="h-4 w-4 mr-2" />
              Share Selected
            </Button>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 h-full">
            <div className=" mb-2 font-medium">No resources found</div>
            <p className="text-sm text-muted-foreground text-center">
              Get started by adding your first resource.
            </p>
          </div>
        ) : (
          <UITable>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedIds.size === resources.length &&
                      resources.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map(resource => (
                <TableRow
                  key={resource.id}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell
                    className="font-medium"
                    onClick={() => router.push(`/resources/${resource.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        {getStatusIcon(resource)}
                        {resource.processing_error && (
                          <div className="absolute hidden group-hover:block bg-black text-white p-2 rounded z-10 -top-8 left-0 whitespace-nowrap">
                            {resource.processing_error}
                          </div>
                        )}
                      </div>
                      {resource.title}
                    </div>
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/resources/${resource.id}`)}
                  >
                    {resource.category}
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/resources/${resource.id}`)}
                  >
                    {resource.description}
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/resources/${resource.id}`)}
                  >
                    {new Date(resource.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleShare(resource.id)}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(resource.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(resource.id)}
                      onCheckedChange={(checked: CheckedState) => {
                        handleCheckboxChange(
                          resource.id,
                          checked === true,
                          (window.event as MouseEvent)?.shiftKey ?? false
                        )
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        )}
      </div>
    </div>
  )
}

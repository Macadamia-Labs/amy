'use client'

import Loader from '@/components/lottie/loader'
import { useResources } from '@/components/providers/resources-provider'
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
import { categoryIcons } from '@/data/resources'
import {
  deleteResource,
  deleteResources,
  reprocessResource,
  shareResource
} from '@/lib/queries/client'
import { Resource } from '@/lib/types'
import { FolderIcon, FolderOpenIcon } from '@/lib/utils/icons'
import {
  getResourceSourceIcon,
  getResourceSourceName,
  getResourceStatusIcon
} from '@/lib/utils/resource-helpers'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Loader2, MoreHorizontal, RefreshCw, Share, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingDots from '../magicui/loading-dots'

interface ResourceSourceCellProps {
  resource: Resource
}

function ResourceSourceCell({ resource }: ResourceSourceCellProps) {
  return (
    <div className="relative group">
      <div className="flex justify-center">
        {getResourceSourceIcon(resource)}
      </div>
      <div className="absolute hidden group-hover:block bg-black text-white p-2 rounded z-10 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
        {getResourceSourceName(resource)}
      </div>
    </div>
  )
}

export function ResourcesTable() {
  const { resources, removeResource, uploadStatus, setUploadStatus } =
    useResources()
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [reprocessingIds, setReprocessingIds] = useState<Set<string>>(new Set())

  // Initialize expandedFolders with no folders expanded by default
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Clear selected IDs when resources change
  useEffect(() => {
    // When resources change, check if selected IDs are still valid
    if (resources.length > 0) {
      const validIds = new Set(resources.map(r => r.id))
      setSelectedIds(prev => {
        const newSelected = new Set<string>()
        prev.forEach(id => {
          if (validIds.has(id)) {
            newSelected.add(id)
          }
        })
        return newSelected
      })
    }
  }, [resources])

  // Group resources by parent_id
  const resourcesByParent = resources.reduce((acc, resource) => {
    const parentId = resource.parent_id || 'root'
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

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
      setDeletingIds(new Set(selectedIds))
      await deleteResources(Array.from(selectedIds))
      selectedIds.forEach(id => removeResource(id))
      setSelectedIds(new Set())
      toast.success('Selected resources deleted successfully')
    } catch (error) {
      console.error('Error deleting resources:', error)
      toast.error('Failed to delete some resources')
    } finally {
      setDeletingIds(new Set())
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

  const isResourceProcessing = (resource: Resource) => {
    return (
      resource.status === 'pending' ||
      resource.status === 'processing' ||
      uploadStatus.get(resource.id) === 'loading'
    )
  }

  const getStatusIcon = (resource: Resource) => {
    return getResourceStatusIcon(resource, uploadStatus)
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

  const handleReprocess = async (id: string) => {
    try {
      setReprocessingIds(new Set([id]))
      setUploadStatus(id, 'loading')
      await reprocessResource(id)
      toast.success('Resource reprocessing started')
    } catch (error) {
      console.error('Error reprocessing resource:', error)
      toast.error('Failed to reprocess resource')
      setUploadStatus(id, 'error')
    } finally {
      setReprocessingIds(new Set())
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingIds(new Set([id]))
      await deleteResource(id)
      removeResource(id)
      toast.success('Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    } finally {
      setDeletingIds(new Set())
    }
  }

  const renderResourceRow = (resource: Resource, level: number = 0) => {
    const isFolder = resource.is_folder
    const isExpanded = expandedFolders.has(resource.id)
    const childResources = resourcesByParent[resource.id] || []
    const isProcessing = isResourceProcessing(resource)

    return (
      <React.Fragment key={resource.id}>
        <TableRow
          className="hover:bg-muted/50 cursor-pointer"
          onClick={e => {
            if (isFolder) {
              e.stopPropagation()
              toggleFolder(resource.id)
            } else {
              router.push(`/resources/${resource.id}`)
            }
          }}
        >
          <TableCell className="font-medium">
            <div
              className="flex items-center gap-3"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              <div className="flex items-center gap-3">
                {isFolder ? (
                  isExpanded ? (
                    <FolderOpenIcon className="size-6 text-muted-foreground" />
                  ) : (
                    <FolderIcon className="size-6 text-muted-foreground" />
                  )
                ) : isProcessing ? (
                  <Loader className="size-6 text-blue-500" />
                ) : resource.title.startsWith('ASME') ? (
                  categoryIcons['Technical Document'] &&
                  React.createElement(categoryIcons['Technical Document'], {
                    className: 'size-6 text-muted-foreground'
                  })
                ) : (
                  categoryIcons[
                    resource.category as keyof typeof categoryIcons
                  ] &&
                  React.createElement(
                    categoryIcons[
                      resource.category as keyof typeof categoryIcons
                    ],
                    {
                      className: 'size-6 text-muted-foreground'
                    }
                  )
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium">{resource.title}</span>
                  <div className="text-xs text-muted-foreground font-light line-clamp-1">
                    {isFolder ? (
                      `${childResources.length} items`
                    ) : isProcessing ? (
                      <span>
                        Processing
                        <LoadingDots />
                      </span>
                    ) : resource.status === 'error' ||
                      uploadStatus.get(resource.id) === 'error' ? (
                      <span className="text-red-500/80">
                        {resource.processing_error || 'Processing failed'}
                      </span>
                    ) : (
                      resource.description || 'No description'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            {!isFolder && (
              <div className="relative group">
                <div className="mx-auto w-fit m">{getStatusIcon(resource)}</div>
                {resource.processing_error && (
                  <div className="absolute hidden group-hover:block bg-black text-white p-2 rounded z-10 -top-8 left-0 whitespace-nowrap max-w-[300px] break-words">
                    <div className="font-medium text-red-400 mb-1">
                      Processing Error:
                    </div>
                    {resource.processing_error}
                  </div>
                )}
              </div>
            )}
          </TableCell>
          <TableCell>{!isFolder && resource.category}</TableCell>
          <TableCell>
            {!isFolder && <ResourceSourceCell resource={resource} />}
          </TableCell>
          <TableCell>
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
                {!isFolder && (
                  <>
                    <DropdownMenuItem onClick={() => handleShare(resource.id)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleReprocess(resource.id)}
                      disabled={
                        reprocessingIds.has(resource.id) || isProcessing
                      }
                      className={`focus:bg-muted ${
                        resource.status === 'error' ||
                        uploadStatus.get(resource.id) === 'error'
                          ? 'text-red-500 focus:text-red-500'
                          : ''
                      }`}
                    >
                      {reprocessingIds.has(resource.id) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {resource.status === 'error' ||
                      uploadStatus.get(resource.id) === 'error'
                        ? 'Retry Processing'
                        : 'Reprocess'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => handleDelete(resource.id)}
                  className="text-destructive focus:text-destructive"
                  disabled={deletingIds.has(resource.id)}
                >
                  {deletingIds.has(resource.id) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
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
        {isFolder &&
          isExpanded &&
          childResources.map(child => renderResourceRow(child, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resources</h2>
          <p className="text-muted-foreground">
            Access engineering documents, standards, and project communications
          </p>
          <p>Number of resources: {resources.length}</p>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deletingIds.size > 0}
            >
              {deletingIds.size > 0 ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
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
            <div className="mb-2 font-medium">No resources found</div>
            <p className="text-sm text-muted-foreground text-center">
              Get started by adding your first resource.
            </p>
          </div>
        ) : (
          <UITable>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Date</TableHead>
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
              {(resourcesByParent['root'] || []).map(resource =>
                renderResourceRow(resource)
              )}
            </TableBody>
          </UITable>
        )}
      </div>
    </div>
  )
}

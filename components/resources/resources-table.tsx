'use client'

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
  getSignedFileUrl,
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
import { Copy, Link2, Loader2, MoreHorizontal, RefreshCw, Share, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingDots from '../magicui/loading-dots'
import { Badge } from '../ui/badge'
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

// New component for rendering resource icons
interface ResourceIconProps {
  resource: Resource
  isExpanded?: boolean
}

function ResourceIcon({ resource, isExpanded = false }: ResourceIconProps) {
  if (resource.is_folder) {
    return isExpanded ? (
      <FolderOpenIcon className="size-6 text-muted-foreground" />
    ) : (
      <FolderIcon className="size-6 text-muted-foreground" />
    )
  }

  // Handle special case for ASME documents
  if (
    resource.title.startsWith('ASME') &&
    categoryIcons['Technical Document']
  ) {
    return React.createElement(categoryIcons['Technical Document'], {
      className: 'size-6 text-muted-foreground'
    })
  }

  // Check if the category exists in categoryIcons
  if (
    resource.category &&
    categoryIcons[resource.category as keyof typeof categoryIcons]
  ) {
    const CategoryIcon =
      categoryIcons[resource.category as keyof typeof categoryIcons]
    return <CategoryIcon className="size-6 text-muted-foreground" />
  }

  // For "Standards" category, use Technical Document icon
  if (
    resource.category === 'Standards' &&
    categoryIcons['Technical Document']
  ) {
    return React.createElement(categoryIcons['Technical Document'], {
      className: 'size-6 text-muted-foreground'
    })
  }

  if (resource.file_type === 'pdf') {
    return React.createElement(categoryIcons['pdf'], {
      className: 'size-6 text-muted-foreground'
    })
  }

  if (
    resource.file_type === 'png' ||
    resource.file_type === 'jpg' ||
    resource.file_type === 'jpeg'
  ) {
    return React.createElement(categoryIcons['image'], {
      className: 'size-6 text-muted-foreground'
    })
  }

  // Use TextFileIcon as fallback for document-type resources
  if (categoryIcons['uncategorized']) {
    return React.createElement(categoryIcons['uncategorized'], {
      className: 'size-6 text-muted-foreground'
    })
  }

  // Ultimate fallback
  return getResourceStatusIcon(resource, new Map())
}

export function ResourcesTable() {
  const { resources, removeResources, uploadStatus, setUploadStatus } =
    useResources()
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reprocessingIds, setReprocessingIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Get root level resources for pagination
  const rootResources = (resourcesByParent['root'] || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const totalPages = Math.ceil(rootResources.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRootResources = rootResources.slice(startIndex, endIndex)

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
    const idsToDelete = Array.from(selectedIds)
    if (idsToDelete.length === 0) return

    try {
      console.log('[handleBulkDelete] Starting bulk delete for:', idsToDelete)
      setIsDeleting(true)
      
      // Add a timeout of 60 seconds for bulk operations
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Bulk delete operation timed out')), 30000)
      })

      await Promise.race([deleteResources(idsToDelete), timeoutPromise])
      
      console.log('[handleBulkDelete] Delete successful, updating UI')
      removeResources(idsToDelete)
      setSelectedIds(new Set())
      toast.success('Selected resources deleted successfully')
    } catch (error) {
      console.error('[handleBulkDelete] Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete some resources')
      // Keep the deletingIds state to show loading state for failed deletions
    } finally {
      setIsDeleting(false)
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
    return resource.status === 'processing'
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

  const handleCopySignedUrl = async (id: string) => {
    const loadingToast = toast.loading('Generating signed URL...', )
    try {
      const signedUrl = await getSignedFileUrl(id)
      await navigator.clipboard.writeText(signedUrl)
      toast.success('Signed URL copied to clipboard')
    } catch (error) {
      console.error('Error getting signed URL:', error)
      toast.error('Failed to get signed URL')
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      toast.success('Resource ID copied to clipboard')
    } catch (error) {
      console.error('Error copying ID:', error)
      toast.error('Failed to copy resource ID')
    }
  }

  const handleReprocess = async (id: string) => {
    try {
      setReprocessingIds(new Set([id]))
      setUploadStatus(id, 'processing')
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
      console.log('[handleDelete] Starting delete for:', id)
      setIsDeleting(true)
      
      // Add a timeout of 30 seconds for single delete
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Delete operation timed out')), 30000)
      })

      await Promise.race([deleteResource(id), timeoutPromise])
      
      console.log('[handleDelete] Delete successful, updating UI')
      removeResources(id)
      toast.success('Resource deleted successfully')
    } catch (error) {
      console.error('[handleDelete] Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete resource')
      // Keep the deletingIds state to show loading state for failed deletion
    } finally {
      setIsDeleting(false)
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
                <ResourceIcon resource={resource} isExpanded={isExpanded} />
                <div className="flex-1">
                  <span className="text-sm font-medium">{resource.title}</span>
                  <div className="text-xs text-muted-foreground font-light line-clamp-1">
                    {isFolder ? (
                      `${childResources.length} items`
                    ) : uploadStatus.get(resource.id) === 'processing' ? (
                      <span>
                        Processing
                        <LoadingDots />
                      </span>
                    ) : resource.status === 'processing' ? (
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
          <TableCell>
            {!isFolder && <Badge variant="outline">{resource.category}</Badge>}
          </TableCell>
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
                    <DropdownMenuItem onClick={() => handleCopySignedUrl(resource.id)}>
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy Signed URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyId(resource.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy ID
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
                  disabled={isDeleting}
                >
                  {isDeleting ? (
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
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
          <>
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
                {paginatedRootResources.map(resource =>
                  renderResourceRow(resource)
                )}
              </TableBody>
            </UITable>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, rootResources.length)} of{' '}
                  {rootResources.length} resources
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
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
import {
  CheckCircle2,
  Loader2,
  MoreHorizontal,
  Share,
  Trash2,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SearchResources } from './search-resources'

export function ResourcesTable() {
  const { resources, removeResource, processingResources, uploadStatus } =
    useResources()
  const [filteredResources, setFilteredResources] = useState(resources)

  useEffect(() => {
    setFilteredResources(resources)
  }, [resources])

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
      // Update both the context and the filtered list
      removeResource(id)
      setFilteredResources(prev => prev.filter(r => r.id !== id))
      toast.success('Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <SearchResources
          resources={resources}
          onFilter={setFilteredResources}
        />
      </div>
      <div className="border rounded-lg">
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map(resource => {
              const IconComponent =
                categoryIcons[resource.category as keyof typeof categoryIcons]
              const status = uploadStatus.get(resource.id)

              let StatusIcon:
                | typeof IconComponent
                | typeof Loader2
                | typeof XCircle
                | typeof CheckCircle2 = IconComponent
              let statusColor = 'text-muted-foreground'

              if (
                status === 'loading' ||
                processingResources.has(resource.id)
              ) {
                StatusIcon = Loader2
                statusColor = 'text-blue-500 animate-spin'
              } else if (status === 'error') {
                StatusIcon = XCircle
                statusColor = 'text-red-500'
              } else if (status === 'success') {
                StatusIcon = CheckCircle2
                statusColor = 'text-green-500'
              }

              return (
                <TableRow key={resource.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/resources/${resource.id}`}
                      className="flex items-center gap-2"
                    >
                      {StatusIcon && (
                        <div className="relative group">
                          <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                          {resource.processing_error && (
                            <div className="absolute hidden group-hover:block bg-black text-white p-2 rounded z-10 -top-8 left-0 whitespace-nowrap">
                              {resource.processing_error}
                            </div>
                          )}
                        </div>
                      )}
                      {resource.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/resources/${resource.id}`} className="block">
                      {resource.category}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/resources/${resource.id}`} className="block">
                      {resource.description}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/resources/${resource.id}`} className="block">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell>
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
                </TableRow>
              )
            })}
          </TableBody>
        </UITable>
      </div>
    </>
  )
}

'use client'

import {
  Resource,
  useResources
} from '@/components/providers/resources-provider'
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
import { CheckCircleIcon, XCircleIcon } from '@/lib/utils/icons'
import { Loader2, MoreHorizontal, Share, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SearchResources } from './search-resources'

export function ResourcesTable() {
  const { resources, removeResource, processingResources } = useResources()
  const [filteredResources, setFilteredResources] = useState(resources)

  useEffect(() => {
    setFilteredResources(resources)
  }, [resources])

  const getStatusIcon = (resource: Resource) => {
    const IconComponent =
      categoryIcons[resource.category as keyof typeof categoryIcons]

    if (resource.status === 'pending' || processingResources.has(resource.id)) {
      return <Loader2 className="size-6 text-blue-500 animate-spin" />
    } else if (resource.status === 'error') {
      return <XCircleIcon className="size-6 text-red-500" />
    } else if (resource.status === 'completed') {
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
              return (
                <TableRow key={resource.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/resources/${resource.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative group">
                        {getStatusIcon(resource)}
                        {resource.processing_error && (
                          <div className="absolute hidden group-hover:block bg-black text-white p-2 rounded z-10 -top-8 left-0 whitespace-nowrap">
                            {resource.processing_error}
                          </div>
                        )}
                      </div>
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

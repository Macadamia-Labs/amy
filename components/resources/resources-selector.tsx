'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Resource } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getResourceSourceIcon } from '@/lib/utils/resource-helpers'
import { Check, ChevronsUpDown, FileText } from 'lucide-react'
import * as React from 'react'
import { Badge } from '../ui/badge'

interface ResourcesSelectorProps {
  selectedIds: Set<string>
  onSelect: (ids: Set<string>) => void
}

export function ResourcesSelector({
  selectedIds,
  onSelect
}: ResourcesSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [showContentDialog, setShowContentDialog] = React.useState(false)
  const { resources } = useResources()

  // Group resources by category
  const groupedResources = React.useMemo(() => {
    return resources.reduce((acc, resource) => {
      const category = resource.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(resource)
      return acc
    }, {} as Record<string, Resource[]>)
  }, [resources])

  const handleSelect = (resourceId: string) => {
    const newSelectedIds = new Set(selectedIds)
    if (newSelectedIds.has(resourceId)) {
      newSelectedIds.delete(resourceId)
    } else {
      newSelectedIds.add(resourceId)
    }
    onSelect(newSelectedIds)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === resources.length) {
      onSelect(new Set())
    } else {
      onSelect(new Set(resources.map(r => r.id)))
    }
  }

  const selectedResources = React.useMemo(() => {
    return resources.filter(resource => selectedIds.has(resource.id))
  }, [resources, selectedIds])

  const concatenatedContent = React.useMemo(() => {
    return selectedResources
      .map(resource => resource.content_as_text)
      .filter(Boolean)
      .join('\n\n---\n\n')
  }, [selectedResources])

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between rounded-full"
          >
            {selectedIds.size > 0 ? (
              <Badge variant="secondary" className="rounded-full">
                {selectedIds.size} selected
              </Badge>
            ) : (
              'Select resources'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search resources..." />
            <CommandList>
              <CommandEmpty>No resources found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={handleSelectAll}>
                  <div className="flex items-center justify-between w-full">
                    <span>Select all</span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedIds.size === resources.length
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </div>
                </CommandItem>
              </CommandGroup>
              {Object.entries(groupedResources).map(([category, resources]) => (
                <CommandGroup key={category} heading={category}>
                  {resources.map(resource => {
                    const icon = getResourceSourceIcon(resource)
                    return (
                      <CommandItem
                        key={resource.id}
                        value={resource.id}
                        onSelect={() => handleSelect(resource.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 text-muted-foreground">
                              {icon}
                            </div>
                            <span>{resource.title}</span>
                          </div>
                          <Check
                            className={cn(
                              'h-4 w-4',
                              selectedIds.has(resource.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds.size > 0 && (
        <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              title="View selected content"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Selected Resources Content</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto h-[400px]">
              <pre className="font-mono text-sm whitespace-pre-wrap p-4 bg-muted rounded-lg">
                {concatenatedContent ||
                  'No content available for selected resources.'}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

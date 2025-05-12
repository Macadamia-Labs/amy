'use client'

import { useResources } from '@/components/providers/resources-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TextFileIcon } from '@/lib/utils/icons'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

interface Resource {
  id: string
  name: string
  signedFileUrl: string
  type: string
}

interface ErrorChecksResourcesCardProps {
  selectedResourceIds: Set<string>
  onSelectResource: (resourceIds: Set<string>) => void
}

export function ErrorChecksResourcesCard({
  selectedResourceIds,
  onSelectResource
}: ErrorChecksResourcesCardProps) {
  const { resources } = useResources()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedResources = resources.filter(resource =>
    selectedResourceIds.has(resource.id)
  )

  function handleToggleResource(resourceId: string) {
    const newSet = new Set(selectedResourceIds)
    if (newSet.has(resourceId)) {
      newSet.delete(resourceId)
    } else {
      newSet.add(resourceId)
    }
    onSelectResource(newSet)
  }

  return (
    <Card className="bg-card rounded-3xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <CardTitle className="flex flex-row items-center">
          <TextFileIcon className="size-6 mr-2" /> Resources
        </CardTitle>
        <div className="absolute right-4 top-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <CommandDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTitle className="sr-only">Select Resources</DialogTitle>
            <Command className="rounded-none bg-transparent">
              <CommandInput
                placeholder="Search resources"
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No resources found.</CommandEmpty>
                <CommandGroup>
                  {resources.map(resource => (
                    <CommandItem
                      key={resource.id}
                      onSelect={() => handleToggleResource(resource.id)}
                      className="flex cursor-pointer flex-row items-center p-2 px-3 rounded-lg"
                    >
                      <span className="truncate flex-1 text-left">
                        {resource.title}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {resource.category}
                      </span>
                      {selectedResourceIds.has(resource.id) && (
                        <Check className="ml-auto size-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {selectedResources.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No resources selected.
          </div>
        ) : (
          <ul className="space-y-2">
            {selectedResources.map(resource => (
              <li key={resource.id}>
                <div
                  className={cn(
                    'w-full flex items-center px-4 py-2 rounded-lg border bg-muted'
                  )}
                >
                  <span className="truncate flex-1 text-left">
                    {resource.title}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {resource.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

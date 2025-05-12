'use client'

import { useResources } from '@/components/providers/resources-provider'
import { useWorkflows } from '@/components/providers/workflows-provider'
import { ResourcesSelector } from '@/components/resources/resources-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  attachResourceToWorkflow,
  detachResourceFromWorkflow
} from '@/lib/actions/workflows'
import { Resource } from '@/lib/types/resource'
import { BoxIcon } from '@/lib/utils/icons'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const SmallResourceCard = ({ resource }: { resource: Resource }) => {
  const router = useRouter()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
          <div>
            <p className="font-medium">{resource.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {resource.description}
            </p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1 rounded-xl">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push(`/resources/${resource.id}`)}
        >
          Inspect Resource
        </Button>
      </PopoverContent>
    </Popover>
  )
}

interface ResourcesCardProps {
  workflowId: string
  initialResourceIds: string[]
}

export function ResourcesCard({
  workflowId,
  initialResourceIds
}: ResourcesCardProps) {
  const { resources } = useResources()
  const { updateWorkflow } = useWorkflows()
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set(initialResourceIds)
  )
  const attachedResources = resources.filter(resource =>
    selectedResourceIds.has(resource.id)
  )

  const handleResourceSelect = async (ids: Set<string>) => {
    // Find resources to add and remove
    const resourcesToAdd = Array.from(ids).filter(
      id => !selectedResourceIds.has(id)
    )
    const resourcesToRemove = Array.from(selectedResourceIds).filter(
      id => !ids.has(id)
    )

    // Update local state
    setSelectedResourceIds(ids)

    // Update in Supabase
    try {
      // Attach new resources
      await Promise.all(
        resourcesToAdd.map(resourceId =>
          attachResourceToWorkflow(workflowId, resourceId)
        )
      )

      // Detach removed resources
      await Promise.all(
        resourcesToRemove.map(resourceId =>
          detachResourceFromWorkflow(workflowId, resourceId)
        )
      )

      // Update workflow in context
      updateWorkflow(workflowId, {
        resourceIds: Array.from(ids)
      })
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update resources'
      })
      // Revert local state on error
      setSelectedResourceIds(selectedResourceIds)
    }
  }

  const ghostTrigger = (
    <Button variant="ghost" size="icon">
      <Plus className="h-4 w-4" />
    </Button>
  )

  return (
    <Card className="bg-card rounded-3xl h-full">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <CardTitle className="flex flex-row items-center">
          <BoxIcon className="size-6 mr-2" /> Attached Resources
        </CardTitle>
        <div className="absolute right-4 top-3">
          <ResourcesSelector
            selectedIds={selectedResourceIds}
            onSelect={handleResourceSelect}
            trigger={ghostTrigger}
          />
        </div>
      </CardHeader>
      <CardContent>
        {attachedResources.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground h-full">
            <p>No resources attached yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attachedResources.map((resource: any) => (
              <SmallResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

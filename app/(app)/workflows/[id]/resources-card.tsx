'use client'

import { useResources } from '@/components/providers/resources-provider'
import { ResourcesSelector } from '@/components/resources/resources-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function ResourcesCard() {
  const { resources } = useResources()

  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set()
  )
  const attachedResources = resources.filter(resource =>
    selectedResourceIds.has(resource.id)
  )

  const handleResourceSelect = (ids: Set<string>) => {
    setSelectedResourceIds(ids)
    const selectedResources = resources.filter(resource => ids.has(resource.id))
  }

  const ghostTrigger = (
    <Button variant="ghost" size="icon">
      <Plus className="h-4 w-4" />
    </Button>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Attached Resources
        </CardTitle>
        <ResourcesSelector
          selectedIds={selectedResourceIds}
          onSelect={handleResourceSelect}
          trigger={ghostTrigger}
        />
      </CardHeader>
      <CardContent>
        {attachedResources.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No resources attached yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attachedResources.map(resource => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-2 bg-muted  rounded-lg"
              >
                <div>
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {resource.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

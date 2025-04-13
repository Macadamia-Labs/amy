'use client'

import { useResources } from '@/components/providers/resources-provider'
import { ResourcesSelector } from '@/components/resources/resources-selector'
import { Resource } from '@/lib/types'
import { useState } from 'react'

interface WorkflowResourceSelectorProps {
  onResourcesChange: (resources: Resource[]) => void
}

export function WorkflowResourceSelector({
  onResourcesChange
}: WorkflowResourceSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { resources } = useResources()

  const handleSelect = (ids: Set<string>) => {
    setSelectedIds(ids)
    const selectedResources = resources.filter(resource => ids.has(resource.id))
    onResourcesChange(selectedResources)
  }

  return (
    <div className="space-y-4">
      <ResourcesSelector selectedIds={selectedIds} onSelect={handleSelect} />
    </div>
  )
}

'use client'

import { useResourceChanges } from '@/hooks/use-resource-changes'
import { useAuth } from '@/lib/providers/auth-provider'
import { Resource, ResourceStatus } from '@/lib/types'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ResourcesContextType {
  resources: Resource[]
  addResources: (newResources: Resource[]) => void
  removeResources: (ids: string | string[]) => void
  uploadStatus: Map<string, ResourceStatus>
  setUploadStatus: (id: string, status: ResourceStatus) => void
  handleResourceUpdate: (resource: Resource) => void
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(
  undefined
)

export function ResourcesProvider({
  children,
  initialResources
}: {
  children: ReactNode
  initialResources: Resource[]
}) {
  const { user } = useAuth()
  const [resources, setResources] = useState<Resource[]>(initialResources)

  const [uploadStatus, setUploadStatusMap] = useState<
    Map<string, ResourceStatus>
  >(new Map())

  const removeResources = (ids: string | string[]) => {
    console.log('Removing resources:', ids)
    const idsToRemove = Array.isArray(ids) ? ids : [ids]

    // Only remove resources that exist in the current state
    setResources(prev => {
      const existingIds = new Set(prev.map(r => r.id))
      const validIdsToRemove = idsToRemove.filter(id => existingIds.has(id))
      return prev.filter(resource => !validIdsToRemove.includes(resource.id))
    })

    // Clean up upload statuses
    setUploadStatusMap(prev => {
      const next = new Map(prev)
      idsToRemove.forEach(id => next.delete(id))
      return next
    })
  }

  const handleResourceUpdate = (updatedResource: Resource) => {
    console.log('Resource updated:', updatedResource)

    setResources(prev => {
      const existingResource = prev.find(r => r.id === updatedResource.id)
      if (!existingResource) {
        // Add new resource and maintain sort order
        return [...prev, updatedResource].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }

      return prev.map(resource =>
        resource.id === updatedResource.id
          ? { ...existingResource, ...updatedResource }
          : resource
      )
    })

    // Only update upload status in specific cases
    if (updatedResource.status === 'error') {
      // Always update to error state if the resource fails
      console.log('Setting upload status to error for', updatedResource.id)
      setUploadStatusMap(prev => new Map(prev).set(updatedResource.id, 'error'))
    } else if (updatedResource.status === 'completed') {
      // For completion, only set to success if not already set
      const currentStatus = uploadStatus.get(updatedResource.id)
      if (currentStatus !== 'completed') {
        console.log(
          'Setting upload status to completed for',
          updatedResource.id
        )
        setUploadStatusMap(prev =>
          new Map(prev).set(updatedResource.id, 'completed')
        )
      }
    }
    // Never downgrade from success to loading based on resource status changes
  }

  // Use the new hook for Supabase changes
  useResourceChanges({
    userId: user?.id,
    onUpdate: handleResourceUpdate,
    onDelete: removeResources
  })

  const addResources = (newResources: Resource[]) => {
    console.log('Adding resources:', newResources)
    // Batch all state updates together for better performance and consistency
    setResources(prev => {
      // Add new resources immediately to the state and maintain sort order
      const updatedResources = [...prev, ...newResources].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      // Remove duplicates while maintaining sort order
      const uniqueResources = updatedResources.filter(
        (resource, index, self) =>
          index === self.findIndex(r => r.id === resource.id)
      )

      console.log('Updated resources:', uniqueResources)

      return uniqueResources
    })

    // Update upload statuses
    setUploadStatusMap(prev => {
      const newStatusMap = new Map(prev)

      newResources.forEach(resource => {
        // Don't override existing upload status unless the resource has a status
        // that would change the upload status
        const currentStatus = newStatusMap.get(resource.id)

        if (resource.status === 'error') {
          // Always set error status
          newStatusMap.set(resource.id, 'error')
        } else if (resource.status === 'completed') {
          // Always set completed resources to completed
          newStatusMap.set(resource.id, 'completed')
        } else if (
          (resource.status === 'pending' || resource.status === 'processing') &&
          currentStatus !== 'completed'
        ) {
          // Only set to loading if current status is not completed
          // This prevents downgrading from completed to loading
          newStatusMap.set(resource.id, 'processing')
        }

        console.log(
          `Set upload status for ${resource.id} to ${newStatusMap.get(
            resource.id
          )}`
        )
      })

      return newStatusMap
    })
  }

  const setUploadStatus = (id: string, status: ResourceStatus) => {
    // Update only the upload status, not the resource status
    console.log(`Setting upload status for ${id} to ${status}`)

    setUploadStatusMap(prev => {
      const newMap = new Map(prev)
      newMap.set(id, status)
      console.log(`New upload status map has ${newMap.size} entries`)
      console.log(`Status for ${id} is now ${newMap.get(id)}`)
      return newMap
    })

    // Only update the resource status for error conditions
    if (status === 'error') {
      setResources(prev =>
        prev.map(resource => {
          if (resource.id !== id) return resource

          return {
            ...resource,
            status: 'error',
            processing_error:
              'Failed to process file. Click retry to try again.'
          }
        })
      )
    }
  }

  return (
    <ResourcesContext.Provider
      value={{
        resources,
        addResources,
        removeResources,
        uploadStatus,
        setUploadStatus,
        handleResourceUpdate
      }}
    >
      {children}
    </ResourcesContext.Provider>
  )
}

export function useResources() {
  const context = useContext(ResourcesContext)
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourcesProvider')
  }
  return context
}

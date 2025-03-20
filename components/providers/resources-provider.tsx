'use client'

import { useResourceChanges } from '@/hooks/use-resource-changes'
import { useAuth } from '@/lib/providers/auth-provider'
import { Resource } from '@/lib/types'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ResourcesContextType {
  resources: Resource[]
  addResources: (newResources: Resource[]) => void
  removeResource: (id: string) => void
  uploadStatus: Map<string, 'loading' | 'success' | 'error'>
  setUploadStatus: (id: string, status: 'loading' | 'success' | 'error') => void
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
    Map<string, 'loading' | 'success' | 'error'>
  >(new Map())

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id))
    setUploadStatusMap(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  const handleResourceUpdate = (updatedResource: Resource) => {
    console.log('Resource updated:', updatedResource)

    setResources(prev => {
      const existingResource = prev.find(r => r.id === updatedResource.id)
      if (!existingResource) return [...prev, updatedResource]

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
      if (currentStatus !== 'success') {
        console.log('Setting upload status to success for', updatedResource.id)
        setUploadStatusMap(prev =>
          new Map(prev).set(updatedResource.id, 'success')
        )
      }
    }
    // Never downgrade from success to loading based on resource status changes
  }

  // Use the new hook for Supabase changes
  useResourceChanges({
    userId: user?.id,
    onUpdate: handleResourceUpdate,
    onDelete: removeResource
  })

  const addResources = (newResources: Resource[]) => {
    console.log('Adding resources:', newResources)
    // Batch all state updates together for better performance and consistency
    setResources(prev => {
      // Add new resources immediately to the state
      const updatedResources = [...prev]

      newResources.forEach(resource => {
        const existingIndex = updatedResources.findIndex(
          r => r.id === resource.id
        )
        if (existingIndex === -1) {
          // Add new resource
          updatedResources.push(resource)
        } else {
          // Update existing resource
          updatedResources[existingIndex] = {
            ...updatedResources[existingIndex],
            ...resource
          }
        }
      })

      console.log('Updated resources:', updatedResources)

      return updatedResources
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
          // Always set completed resources to success
          newStatusMap.set(resource.id, 'success')
        } else if (
          (resource.status === 'pending' || resource.status === 'processing') &&
          currentStatus !== 'success'
        ) {
          // Only set to loading if current status is not success
          // This prevents downgrading from success to loading
          newStatusMap.set(resource.id, 'loading')
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

  const setUploadStatus = (
    id: string,
    status: 'loading' | 'success' | 'error'
  ) => {
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
        removeResource,
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

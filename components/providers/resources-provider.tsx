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

    // Update upload status based on status
    if (updatedResource.status === 'completed') {
      setUploadStatusMap(prev =>
        new Map(prev).set(updatedResource.id, 'success')
      )
    } else if (updatedResource.status === 'error') {
      setUploadStatusMap(prev => new Map(prev).set(updatedResource.id, 'error'))
    } else if (
      updatedResource.status === 'pending' ||
      updatedResource.status === 'processing'
    ) {
      setUploadStatusMap(prev =>
        new Map(prev).set(updatedResource.id, 'loading')
      )
    }
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
        if (resource.status === 'pending' || resource.status === 'processing') {
          newStatusMap.set(resource.id, 'loading')
        } else if (resource.status === 'completed') {
          newStatusMap.set(resource.id, 'success')
        } else if (resource.status === 'error') {
          newStatusMap.set(resource.id, 'error')
        }
      })
      return newStatusMap
    })
  }

  const setUploadStatus = (
    id: string,
    status: 'loading' | 'success' | 'error'
  ) => {
    // Update both the upload status and resource status atomically
    setUploadStatusMap(prev => new Map(prev).set(id, status))

    setResources(prev =>
      prev.map(resource => {
        if (resource.id !== id) return resource

        const updates: Partial<Resource> = {
          status:
            status === 'error'
              ? 'error'
              : status === 'success'
              ? 'completed'
              : 'processing'
        }

        if (status === 'error') {
          updates.processing_error =
            'Failed to process file. Click retry to try again.'
        }

        return { ...resource, ...updates }
      })
    )
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

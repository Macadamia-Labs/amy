'use client'

import { createClient } from '@/lib/supabase/client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  user_id: string
  created_at: string
  processed?: boolean
  processing_result?: any
  processing_completed_at?: string
}

interface ResourcesContextType {
  resources: Resource[]
  addResources: (newResources: Resource[]) => void
  removeResource: (id: string) => void
  processingResources: Set<string>
  setProcessingResource: (id: string) => void
  clearProcessingResource: (id: string) => void
  uploadStatus: Map<string, 'loading' | 'success' | 'error'>
  setUploadStatus: (id: string, status: 'loading' | 'success' | 'error') => void
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
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [processingResources, setProcessingResources] = useState<Set<string>>(
    new Set()
  )
  const [uploadStatus, setUploadStatusMap] = useState<
    Map<string, 'loading' | 'success' | 'error'>
  >(new Map())

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to resource updates
    const subscription = supabase
      .channel('resources')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources'
        },
        payload => {
          const updatedResource = payload.new as Resource
          if (updatedResource.processed) {
            // Update the resource in state
            setResources(prev =>
              prev.map(resource =>
                resource.id === updatedResource.id ? updatedResource : resource
              )
            )
            // Clear processing state
            clearProcessingResource(updatedResource.id)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const setProcessingResource = (id: string) => {
    setProcessingResources(prev => new Set([...prev, id]))
  }

  const clearProcessingResource = (id: string) => {
    setProcessingResources(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const addResources = (newResources: Resource[]) => {
    // Ensure we're working with valid Resource objects
    const validResources = newResources.filter(
      (resource): resource is Resource => {
        return (
          resource &&
          typeof resource.id === 'string' &&
          typeof resource.title === 'string' &&
          typeof resource.description === 'string' &&
          typeof resource.category === 'string' &&
          typeof resource.file_path === 'string' &&
          typeof resource.user_id === 'string' &&
          typeof resource.created_at === 'string'
        )
      }
    )

    setResources(prev => [...prev, ...validResources])
    // Set processing state for new resources
    validResources.forEach(resource => setProcessingResource(resource.id))
  }

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id))
  }

  const setUploadStatus = (
    id: string,
    status: 'loading' | 'success' | 'error'
  ) => {
    setUploadStatusMap(prev => new Map(prev).set(id, status))
  }

  return (
    <ResourcesContext.Provider
      value={{
        resources,
        addResources,
        removeResource,
        processingResources,
        setProcessingResource,
        clearProcessingResource,
        uploadStatus,
        setUploadStatus
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

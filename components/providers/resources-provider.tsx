'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  user_id: string
  created_at: string
  origin: 'drive' | 'confluence' | 'solidworks' | 'matlab' | string
  processed?: boolean
  processing_result?: any
  processing_completed_at?: string
  status?: 'pending' | 'loading' | 'processing' | 'completed' | 'error'
  processing_error?: string
  is_folder?: boolean
  parent_id?: string | null
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
  const { user } = useAuth()
  const resourcesWithFolder = [
    {
      id: 'example-folder',
      title: 'Example Folder',
      description: 'A folder containing resources',
      category: 'folder',
      file_path: '',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      is_folder: true
    } as Resource,
    {
      id: 'example-file-1',
      title: 'Project Requirements.pdf',
      description: 'Technical requirements document for the project',
      category: 'Engineering Drawings',
      file_path: '/example/requirements.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'example-file-2',
      title: 'System Architecture.pdf',
      description: 'High-level system architecture diagrams',
      category: 'Engineering Drawings',
      file_path: '/example/architecture.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'confluence'
    } as Resource,
    {
      id: 'example-file-3',
      title: 'Component Specs.xlsx',
      description: 'Detailed specifications for system components',
      category: 'Excel Sheets',
      file_path: '/example/specs.xlsx',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    ...initialResources.map(r => ({
      ...r,
      parent_id: r.category === 'Engineering Drawings' ? 'example-folder' : null
    }))
  ]
  const [resources, setResources] = useState<Resource[]>(resourcesWithFolder)
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
          table: 'resources',
          filter: `user_id=eq.${user?.id}`
        },
        payload => {
          const updatedResource = payload.new as Resource

          console.log('updatedResource', updatedResource)

          // Update the resource in state
          setResources(prev =>
            prev.map(resource =>
              resource.id === updatedResource.id ? updatedResource : resource
            )
          )

          // Update upload status based on status
          if (updatedResource.status === 'completed') {
            setUploadStatusMap(prev =>
              new Map(prev).set(updatedResource.id, 'success')
            )
          } else if (updatedResource.status === 'error') {
            setUploadStatusMap(prev =>
              new Map(prev).set(updatedResource.id, 'error')
            )
          }

          // Clear processing state if done
          if (updatedResource.status !== 'pending') {
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

    setResources(prev => {
      // Create a map of existing resources for quick lookup
      const existingMap = new Map(prev.map(r => [r.id, r]))

      // Update existing resources or add new ones
      validResources.forEach(resource => {
        existingMap.set(resource.id, {
          ...existingMap.get(resource.id),
          ...resource
        })
      })

      return Array.from(existingMap.values())
    })

    // Set processing state for new resources that are pending
    validResources.forEach(resource => {
      if (resource.status === 'pending') {
        setProcessingResource(resource.id)
      }
    })
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

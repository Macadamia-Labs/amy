'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/lib/types'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

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
      id: 'pressure-vessel-folder',
      title: 'Pressure Vessel',
      description: 'Pressure Vessel related standards and codes',
      category: 'folder',
      file_path: '',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      is_folder: true
    } as Resource,
    {
      id: 'example-folder',
      title: 'ASME Standards',
      description: 'A folder containing resources',
      category: 'folder',
      file_path: '',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      is_folder: true
    } as Resource,
    {
      id: 'aisc-folder',
      title: 'AISC Standards',
      description: 'American Institute of Steel Construction Standards',
      category: 'folder',
      file_path: '',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      is_folder: true
    } as Resource,
    {
      id: 'asce-folder',
      title: 'ASCE Standards',
      description: 'American Society of Civil Engineers Standards',
      category: 'folder',
      file_path: '',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      is_folder: true
    } as Resource,
    {
      id: 'pip-folder',
      title: 'PIP Standards',
      description: 'Process Industry Practices Standards',
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
      parent_id: 'pressure-vessel-folder',
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
      parent_id: 'pressure-vessel-folder',
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
      parent_id: 'pressure-vessel-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-b16-5',
      title: 'ASME B16.5.pdf',
      description: 'Pipe Flanges and Flanged Fittings',
      category: 'Standards',
      file_path: '/demo/asme/ASME B16.5.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-b31-1',
      title: 'ASME B31.1.pdf',
      description: 'Power Piping',
      category: 'Standards',
      file_path: '/demo/asme/ASME B31.1.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-b31-3',
      title: 'ASME B31.3.pdf',
      description: 'Process Piping',
      category: 'Standards',
      file_path: '/demo/asme/ASME B31.3.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-i',
      title: 'ASME BPVC I.pdf',
      description: 'Boiler and Pressure Vessel Code Section I',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC I.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-iv',
      title: 'ASME BPVC IV.pdf',
      description: 'Boiler and Pressure Vessel Code Section IV',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC IV.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-v',
      title: 'ASME BPVC V.pdf',
      description: 'Boiler and Pressure Vessel Code Section V',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC V.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-vi',
      title: 'ASME BPVC VI.pdf',
      description: 'Boiler and Pressure Vessel Code Section VI',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC VI.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-vii',
      title: 'ASME BPVC VII.pdf',
      description: 'Boiler and Pressure Vessel Code Section VII',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC VII.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-ix',
      title: 'ASME BPVC IX.pdf',
      description: 'Boiler and Pressure Vessel Code Section IX',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC IX.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-viii-div-1',
      title: 'ASME BPVC VIII DIV 1.pdf',
      description: 'Boiler and Pressure Vessel Code Section VIII Division 1',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC VIII DIV 1.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-bpvc-viii-div-2',
      title: 'ASME BPVC VIII DIV 2.pdf',
      description: 'Boiler and Pressure Vessel Code Section VIII Division 2',
      category: 'Standards',
      file_path: '/demo/asme/ASME BPVC VIII DIV 2.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-csd-i',
      title: 'ASME CSD I.pdf',
      description: 'Controls and Safety Devices for Automatically Fired Boilers',
      category: 'Standards',
      file_path: '/demo/asme/ASME CSD I.pdf',
      user_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'completed',
      parent_id: 'example-folder',
      origin: 'gdrive'
    } as Resource,
    {
      id: 'asme-y14-5',
      title: 'ASME Y14.5.pdf',
      description: 'Dimensioning and Tolerancing',
      category: 'Standards',
      file_path: '/demo/asme/ASME Y14.5.pdf',
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

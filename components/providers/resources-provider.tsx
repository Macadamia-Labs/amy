'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  file_path: string
  user_id: string
  created_at: string
}

interface ResourcesContextType {
  resources: Resource[]
  addResources: (newResources: Resource[]) => void
  removeResource: (id: string) => void
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
  }

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id))
  }

  return (
    <ResourcesContext.Provider
      value={{ resources, addResources, removeResource }}
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

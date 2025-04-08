'use client'

import { createClient } from '@/lib/supabase/client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Resource } from '../types/database'

export interface Section {
  level: number
  title: string
  content: string
  start?: number
  end?: number
  imageUrl?: string
  sourceUrl?: string
}

interface DocumentContextType {
  content: string
  sections: Section[]
  activeSection: Section | null
  setActiveSection: (section: Section | null) => void
  setContent: (content: string) => void
  getCurrentContext: () => { content: string; activeSection: Section | null }
  resource: Resource | undefined
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
)

export function useDocument() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}

interface DocumentProviderProps {
  children: ReactNode
  initialContent?: string
  resource?: Resource
}

export function DocumentProvider({
  children,
  initialContent = '',
  resource
}: DocumentProviderProps) {
  const [currentResource, setCurrentResource] = useState(resource)
  const [content, setContent] = useState(initialContent)
  const [activeSection, setActiveSection] = useState<Section | null>(null)

  // Memoize sections to prevent unnecessary recalculations
  const sections = useMemo(() => {
    if (resource?.processing_result?.outline?.length) {
      return resource.processing_result.outline
    }
    if (content) {
      return parseMarkdownSections(content)
    }
    return []
  }, [resource?.processing_result?.outline, content])

  // Only subscribe to updates if the resource is still processing
  useEffect(() => {
    if (!resource?.id || resource.status === 'completed') return

    const supabase = createClient()
    const subscription = supabase
      .channel(`resource-${resource.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resources',
          filter: `id=eq.${resource.id}`
        },
        async payload => {
          const updatedResource = payload.new as Resource
          setCurrentResource(updatedResource)

          if (updatedResource.content && updatedResource.content !== content) {
            setContent(updatedResource.content)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [resource?.id, resource?.status])

  function parseMarkdownSections(markdown: string): Section[] {
    if (!markdown) return []

    const lines = markdown.split('\n')
    const sections: Section[] = []
    let currentSection: Section | null = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Handle images
      if (line.trim().match(/^!\[.*?\]\(.*?\)/)) {
        if (currentSection?.content) {
          sections.push(currentSection)
        }
        sections.push({
          level: 2,
          title: 'Image',
          content: line,
          start: i,
          end: i
        })
        currentSection = null
        continue
      }

      // Handle headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 0
        if (level <= 2) {
          if (currentSection?.content) {
            sections.push(currentSection)
          }
          currentSection = {
            level,
            title: line.replace(/^#+\s*/, ''),
            content: line,
            start: i,
            end: i
          }
          continue
        }
      }

      // Add content to current section
      if (currentSection) {
        currentSection.content += '\n' + line
        currentSection.end = i
      } else {
        currentSection = {
          level: 1,
          title: 'Content',
          content: line,
          start: i,
          end: i
        }
      }
    }

    if (currentSection?.content) {
      sections.push(currentSection)
    }

    return sections
  }

  const getCurrentContext = () => ({
    content,
    activeSection
  })

  const value = {
    content,
    sections,
    activeSection,
    setActiveSection,
    setContent,
    getCurrentContext,
    resource: currentResource
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

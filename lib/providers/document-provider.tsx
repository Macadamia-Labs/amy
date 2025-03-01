'use client'

import { createClient } from '@/lib/supabase/client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  const [content, setContent] = useState(
    resource?.embeddings?.map(embedding => embedding.content).join('\n') ||
      initialContent
  )
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [sections, setSections] = useState<Section[]>(
    () =>
      resource?.embeddings?.map(embedding => ({
        level: 1,
        title: embedding.content,
        content: embedding.content,
        imageUrl: embedding.image_url,
        sourceUrl: embedding.source_url
      })) || []
  )

  // Subscribe to real-time updates for this specific resource
  useEffect(() => {
    if (!resource?.id) return

    const supabase = createClient()

    // Set up real-time subscription for this resource
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
          console.log('Resource updated:', payload.new)
          const updatedResource = payload.new as Resource

          setCurrentResource(updatedResource)

          // If resource has embeddings, update the content and sections
          if (updatedResource.embeddings) {
            const newContent = updatedResource.embeddings
              .map(embedding => embedding.content)
              .join('\n')

            setContent(newContent)

            // Update sections based on new embeddings
            const newSections = updatedResource.embeddings.map(embedding => ({
              level: 1,
              title: embedding.content,
              content: embedding.content,
              imageUrl: embedding.image_url,
              sourceUrl: embedding.source_url
            }))

            setSections(newSections)
          } else if (
            updatedResource.content &&
            updatedResource.content !== content
          ) {
            // If resource has content directly, update it
            setContent(updatedResource.content)
            setSections(parseMarkdownSections(updatedResource.content))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [resource?.id])

  function parseMarkdownSections(markdown: string): Section[] {
    const lines = markdown.split('\n')
    const sections: Section[] = []
    let currentSection: Section | null = {
      level: 1,
      title: 'Content',
      content: '',
      start: 0,
      end: 0
    }

    lines.forEach((line, index) => {
      // Handle images as sections
      if (line.trim().match(/^!\[.*?\]\(.*?\)/)) {
        if (currentSection) {
          currentSection.end = index - 1
          if (currentSection.content.trim()) {
            sections.push(currentSection)
          }
        }

        currentSection = {
          level: 2, // Treating images as level 2 sections
          title: 'Image',
          content: line + '\n',
          start: index,
          end: index
        }
        sections.push(currentSection)
        currentSection = {
          level: 1,
          title: 'Content',
          content: '',
          start: index + 1,
          end: index + 1
        }
        return
      }

      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 0
        if (level > 2) {
          if (currentSection) {
            currentSection.content += line + '\n'
          }
          return
        }

        if (currentSection) {
          currentSection.end = index - 1
          if (currentSection.content.trim()) {
            sections.push(currentSection)
          }
        }

        const title = line.replace(/^#+\s*/, '')
        currentSection = {
          level,
          title,
          content: line + '\n',
          start: index,
          end: index
        }
      } else if (currentSection) {
        currentSection.content += line + '\n'
        currentSection.end = index
      }
    })

    if (currentSection && currentSection.content.trim()) {
      sections.push(currentSection)
    }

    return sections
  }

  const getCurrentContext = () => ({
    content,
    activeSection
  })

  const handleSetContent = (newContent: string) => {
    setContent(newContent)
    setSections(parseMarkdownSections(newContent))
  }

  const value = {
    content,
    sections,
    activeSection,
    setActiveSection,
    setContent: handleSetContent,
    getCurrentContext,
    resource: currentResource
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

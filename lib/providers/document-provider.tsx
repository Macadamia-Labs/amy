import { createContext, ReactNode, useContext, useState } from 'react'

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
}

interface DocumentContextType {
  content: string
  sections: Section[]
  activeSection: Section | null
  setActiveSection: (section: Section | null) => void
  setContent: (content: string) => void
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
}

export function DocumentProvider({
  children,
  initialContent = ''
}: DocumentProviderProps) {
  const [content, setContent] = useState(initialContent)
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [sections, setSections] = useState<Section[]>(() =>
    parseMarkdownSections(initialContent)
  )

  function parseMarkdownSections(markdown: string): Section[] {
    const lines = markdown.split('\n')
    const sections: Section[] = []
    let currentSection: Section | null = null

    lines.forEach((line, index) => {
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
          sections.push(currentSection)
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

    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }

  const handleSetContent = (newContent: string) => {
    setContent(newContent)
    setSections(parseMarkdownSections(newContent))
  }

  const value = {
    content,
    sections,
    activeSection,
    setActiveSection,
    setContent: handleSetContent
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Copy, Link, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useEffect, useRef } from 'react'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
  children?: Section[]
}

interface DocContentProps {
  sections: Section[]
  activeSection: Section | null
}

function findMainSection(
  sections: Section[],
  activeSection: Section | null
): Section | null {
  if (!activeSection) return null

  // If it's a top-level section, return it
  const topLevelSection = sections.find(s => s.title === activeSection.title)
  if (topLevelSection) return topLevelSection

  // Otherwise, find the parent section
  const parentSection = sections.find(section => {
    const findInChildren = (children?: Section[]): boolean => {
      if (!children) return false
      return children.some(
        child =>
          child.title === activeSection.title || findInChildren(child.children)
      )
    }
    return findInChildren(section.children)
  })

  return parentSection || null
}

function getAllSectionsContent(section: Section): Section[] {
  const result: Section[] = [section]
  if (section.children) {
    section.children.forEach(child => {
      result.push(...getAllSectionsContent(child))
    })
  }
  return result
}

export function DocContent({ sections, activeSection }: DocContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard')
    } catch (error) {
      console.error('Failed to copy text:', error)
      toast.error('Failed to copy text to clipboard')
    }
  }

  useEffect(() => {
    if (activeSection && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  if (!activeSection) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a section from the sidebar to view its content
      </div>
    )
  }

  const getSectionGroup = () => {
    const index = sections.findIndex(s => s.title === activeSection.title)
    if (index === -1) return [activeSection]
    let startIndex = index
    // find nearest preceding section with level 1
    for (let i = index; i >= 0; i--) {
      if (sections[i].level === 1) {
        startIndex = i
        break
      }
    }
    const group: typeof sections = []
    for (let i = startIndex; i < sections.length; i++) {
      if (i > startIndex && sections[i].level === 1) break
      group.push(sections[i])
    }
    return group
  }
  const sectionGroup = getSectionGroup()

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl">
        <div className="prose dark:prose-invert">
          {sectionGroup.map((section, index) => (
            <div
              key={index}
              className={`group relative ${
                section.title === activeSection.title
                  ? 'bg-muted rounded-lg'
                  : ''
              }`}
              ref={section.title === activeSection.title ? activeRef : null}
            >
              <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 border transition-opacity flex gap-1 bg-card rounded-md p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={e => {
                    e.stopPropagation()
                    copyToClipboard(section.content)
                  }}
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={e => {
                    e.stopPropagation()
                    // Add share functionality
                  }}
                  title="Share link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={e => {
                    e.stopPropagation()
                    // Add feedback/comment functionality
                  }}
                  title="Feedback"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={e => {
                    e.stopPropagation()
                    // Add more options
                  }}
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <MemoizedReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                className="prose-sm p-4"
              >
                {section.content.trim()}
              </MemoizedReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

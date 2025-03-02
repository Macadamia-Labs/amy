'use client'

import { Button } from '@/components/ui/button'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import {
  CheckIcon,
  CopyIcon,
  LinkIcon,
  MessageCircleIcon,
  MoreHorizontalIcon
} from '@/lib/utils/icons'
import { useEffect, useRef, useState } from 'react'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

interface Section {
  level: number
  title: string
  content: string
  start?: number
  end?: number
  children?: Section[]
}

interface DocContentProps {
  sections: Section[]
  activeSection: Section | null
  onSectionSelect?: (section: Section) => void
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

export function DocContent({
  sections,
  activeSection,
  onSectionSelect
}: DocContentProps) {
  const activeRef = useRef<HTMLDivElement>(null)
  const [showCheckMark, setShowCheckMark] = useState<{
    type: 'copy' | 'link' | null
    sectionIndex: number | null
  }>({ type: null, sectionIndex: null })

  const copyToClipboard = async (text: string, sectionIndex: number) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard', {
        duration: 1000
      })
      setShowCheckMark({ type: 'copy', sectionIndex })
      setTimeout(() => {
        setShowCheckMark({ type: null, sectionIndex: null })
      }, 1000) // Match toast duration
    } catch (error) {
      console.error('Failed to copy text:', error)
      toast.error('Failed to copy text to clipboard', {
        duration: 1000
      })
    }
  }

  const handleShare = (sectionIndex: number) => {
    // Add share functionality
    toast.success('Link copied to clipboard', {
      duration: 1000
    })
    setShowCheckMark({ type: 'link', sectionIndex })
    setTimeout(() => {
      setShowCheckMark({ type: null, sectionIndex: null })
    }, 1000) // Match toast duration
  }

  useEffect(() => {
    if (activeSection && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  return (
    <div className="overflow-y-auto h-full w-full">
      <div className="prose dark:prose-invert space-y-2 h-full mx-auto">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`group relative ${
              activeSection?.title === section.title
                ? 'bg-blue-500/20 rounded-lg border border-blue-500/80'
                : 'hover:bg-muted rounded-lg'
            }`}
            ref={activeSection?.title === section.title ? activeRef : null}
            onClick={() => onSectionSelect?.(section)}
            role="button"
            tabIndex={0}
          >
            <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 border transition-opacity flex gap-1 bg-card rounded-xl p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={e => {
                  e.stopPropagation()
                  copyToClipboard(section.content, index)
                }}
                title="Copy"
              >
                {showCheckMark.type === 'copy' &&
                showCheckMark.sectionIndex === index ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={e => {
                  e.stopPropagation()
                  handleShare(index)
                }}
                title="Share link"
              >
                {showCheckMark.type === 'link' &&
                showCheckMark.sectionIndex === index ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <LinkIcon className="size-4" />
                )}
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
                <MessageCircleIcon className="size-4" />
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
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </div>
            <MemoizedReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
              className="prose-sm p-4 w-full max-w-4xl"
            >
              {section.content.trim()}
            </MemoizedReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  )
}

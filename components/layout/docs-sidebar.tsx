'use client'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDocument } from '@/lib/providers/document-provider'
import { cn } from '@/lib/utils'
import { ChevronRight, X } from 'lucide-react'

interface Section {
  level: number
  title: string
  content: string
  start?: number
  end?: number
  children?: Section[]
  imageUrl?: string
  sourceUrl?: string
  page?: number
}

function SectionItem({
  section,
  onSectionSelect,
  activeSection,
  level = 0
}: {
  section: Section
  onSectionSelect: (section: Section) => void
  activeSection?: Section | null
  level?: number
}) {
  const hasChildren = section.children && section.children.length > 0

  if (!hasChildren) {
    return (
      <button
        onClick={() => onSectionSelect(section)}
        className={cn(
          'block w-full text-left py-1 text-sm hover:text-accent-foreground',
          level === 0 ? 'font-medium' : 'text-muted-foreground',
          activeSection?.title === section.title
            ? 'text-primary font-medium'
            : '',
          `ml-${level * 4}`
        )}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{section.title}</span>
          {section.page && (
            <span className="text-xs text-muted-foreground">
              p.{section.page}
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <Collapsible defaultOpen={false} className="group/collapsible">
      <div className="flex items-center py-1">
        <CollapsibleTrigger className="flex items-center gap-2 text-sm hover:text-accent-foreground w-full">
          <div className={`ml-${level * 4} flex items-center gap-2`}>
            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            <div className="flex items-center justify-between w-full">
              <span
                onClick={() => onSectionSelect(section)}
                className={cn(
                  'truncate',
                  activeSection?.title === section.title
                    ? 'text-primary font-medium'
                    : ''
                )}
              >
                {section.title}
              </span>
              {section.page && (
                <span className="text-xs text-muted-foreground">
                  p.{section.page}
                </span>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="border-l ml-4 pl-2">
          {section.children?.map((child, index) => (
            <SectionItem
              key={index}
              section={child}
              onSectionSelect={onSectionSelect}
              activeSection={activeSection}
              level={level + 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

interface DocsSidebarProps {
  onSectionSelect: (section: Section) => void
  activeSection?: Section | null
  onClose: () => void
}

export function DocsSidebar({
  onSectionSelect,
  activeSection,
  onClose
}: DocsSidebarProps) {
  const { resource } = useDocument()
  const outline = resource?.processing_result?.outline || []

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b h-12">
          <span className="text-sm font-medium">Documentation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            {outline.map((section: Section, index: number) => (
              <SectionItem
                key={index}
                section={section}
                onSectionSelect={onSectionSelect}
                activeSection={activeSection}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

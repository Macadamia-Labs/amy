'use client'

import { docs } from '@/app/(app)/docs/content'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
  children?: Section[]
}

function buildHierarchy(sections: Section[]): Section[] {
  const hierarchy: Section[] = []
  const stack: Section[] = []

  sections.forEach(section => {
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop()
    }

    const newSection = { ...section, children: [] }

    if (stack.length === 0) {
      hierarchy.push(newSection)
    } else {
      if (!stack[stack.length - 1].children) {
        stack[stack.length - 1].children = []
      }
      stack[stack.length - 1].children?.push(newSection)
    }

    stack.push(newSection)
  })

  return hierarchy
}

function parseMarkdownSections(markdown: string): Section[] {
  const lines = markdown.split('\n')
  const sections: Section[] = []
  let currentSection: Section | null = null

  lines.forEach((line, index) => {
    if (line.startsWith('#')) {
      if (currentSection) {
        currentSection.end = index - 1
        sections.push(currentSection)
      }

      const level = line.match(/^#+/)?.[0].length || 0
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

interface DocsSidebarProps {
  onSectionSelect: (section: Section) => void
  activeSection?: Section | null
}

function SectionItem({
  section,
  onSectionSelect,
  activeSection,
  level = 0,
  sectionPath = ''
}: {
  section: Section
  onSectionSelect: (section: Section) => void
  activeSection?: Section | null
  level?: number
  sectionPath?: string
}) {
  const hasChildren = section.children && section.children.length > 0

  if (!hasChildren) {
    return (
      <button
        onClick={() => onSectionSelect(section)}
        className={`block w-full text-left py-1 text-sm ${
          level === 0 ? 'font-medium' : 'text-muted-foreground'
        } hover:text-accent-foreground ml-${level * 2} ${
          activeSection?.title === section.title
            ? 'text-primary font-medium'
            : ''
        }`}
      >
        <span className="text-muted-foreground mr-2">{sectionPath}</span>
        <span className="truncate w-full text-left">{section.title}</span>
      </button>
    )
  }

  return (
    <Collapsible defaultOpen={true} className="group/collapsible">
      <div className="flex items-center py-1">
        <CollapsibleTrigger
          onClick={() => onSectionSelect(section)}
          className={`flex items-center gap-2 text-sm hover:text-accent-foreground ml-${
            level * 2
          } ${
            activeSection?.title === section.title
              ? 'text-primary font-medium'
              : ''
          }`}
        >
          <span className="text-muted-foreground mr-1">{sectionPath}</span>
          <span className="truncate w-full text-left">{section.title}</span>
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
              sectionPath={
                sectionPath ? `${sectionPath}.${index + 1}` : `${index + 1}`
              }
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function DocsSidebar({
  onSectionSelect,
  activeSection
}: DocsSidebarProps) {
  const sections = parseMarkdownSections(docs['asme'])
  const hierarchy = buildHierarchy(sections)

  return (
    <div className="w-96 h-full border rounded-lg bg-sidebar">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-medium">Documentation</span>
        </div>
        <div className="flex-1 overflow-auto px-2">
          {hierarchy.map((section, index) => (
            <SectionItem
              key={index}
              section={section}
              onSectionSelect={onSectionSelect}
              activeSection={activeSection}
              sectionPath={`${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

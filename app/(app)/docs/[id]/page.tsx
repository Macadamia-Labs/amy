'use client'

import { DocsSidebar } from '@/components/layout/docs-sidebar'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { docs } from '../content'
import { DocContent } from './doc-content'

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
}

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

interface PageProps {
  params: {
    id: string
  }
}

export default function DocsPage({ params }: PageProps) {
  const content = docs[params.id as keyof typeof docs]
  const [activeSection, setActiveSection] = useState<Section | null>(null)

  if (!content) {
    notFound()
  }

  const sections = parseMarkdownSections(content)

  return (
    <div className="flex h-full w-full">
      <DocsSidebar
        onSectionSelect={setActiveSection}
        activeSection={activeSection}
      />
      <div className="flex-1 h-full overflow-auto">
        <DocContent sections={sections} activeSection={activeSection} />
      </div>
    </div>
  )
}

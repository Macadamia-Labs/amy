'use client'

import { DocumentChat } from '@/components/chat/document-chat'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { nanoid } from 'nanoid'
import { useCallback, useRef, useState } from 'react'
import { DocContent } from './[id]/doc-content'

const EXAMPLE = `
# Article 1

## General Provisions

### Personnel Qualifications

- **(g)** When the referencing Code Section does not specify qualifications or does not reference directly Article 1 of this Section, qualification may simply involve demonstration in routine manufacturing operations to show that the personnel performing the nondestructive examinations are competent to do so in accordance with the Manufacturer's established procedures.

- **(h)** The user of this Article is responsible for the qualification and certification of NDE Personnel in accordance with the requirements of this Article. The Code User's Quality Program shall stipulate how this is to be accomplished. Qualifications in accordance with a prior edition of SNT-TC-1A, or CP-189 are valid until recertification. Recertification or new certification shall be in accordance with the edition of SNT-TC-1A or CP-189 specified in Footnote 3.

- **(i)** Limited certification of nondestructive examination personnel who do not perform all of the operations of a nondestructive method that consists of more than one operation, or who perform nondestructive examinations of limited scope, may be based on fewer hours of training and experience than recommended in SNT-TC-1A or CP-189. Any limitations or restrictions placed upon a person's certification shall be described in the written practice and on the certification.`

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
  children?: Section[]
}

function parseMarkdownSections(markdown: string): Section[] {
  const lines = markdown.split('\n')
  const sections: Section[] = []
  let currentSection: Section | null = null

  lines.forEach((line, index) => {
    if (line.startsWith('#')) {
      // If we have a current section, save it
      if (currentSection) {
        currentSection.end = index - 1
        sections.push(currentSection)
      }

      // Start a new section
      const level = line.match(/^#+/)?.[0].length || 0
      const title = line.replace(/^#+\s*/, '')
      currentSection = {
        level,
        title,
        content: line + '\n',
        start: index,
        end: index,
        children: []
      }
    } else if (currentSection) {
      currentSection.content += line + '\n'
      currentSection.end = index
    }
  })

  // Don't forget to add the last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const sections = parseMarkdownSections(EXAMPLE)
  const chatId = useRef(nanoid()).current

  const handleSectionSelect = useCallback((section: Section) => {
    setSelectedSection(prev => (prev?.title === section.title ? null : section))
  }, [])

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={65} minSize={40}>
        <DocContent
          sections={sections}
          activeSection={selectedSection}
          onSectionSelect={handleSectionSelect}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={30}>
        <DocumentChat id={chatId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

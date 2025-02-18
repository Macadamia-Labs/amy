'use client'

const EXAMPLE = `
# Article 1

## General Provisions

### Personnel Qualifications

- **(g)** When the referencing Code Section does not specify qualifications or does not reference directly Article 1 of this Section, qualification may simply involve demonstration in routine manufacturing operations to show that the personnel performing the nondestructive examinations are competent to do so in accordance with the Manufacturer's established procedures.

- **(h)** The user of this Article is responsible for the qualification and certification of NDE Personnel in accordance with the requirements of this Article. The Code User's Quality Program shall stipulate how this is to be accomplished. Qualifications in accordance with a prior edition of SNT-TC-1A, or CP-189 are valid until recertification. Recertification or new certification shall be in accordance with the edition of SNT-TC-1A or CP-189 specified in Footnote 3.

- **(i)** Limited certification of nondestructive examination personnel who do not perform all of the operations of a nondestructive method that consists of more than one operation, or who perform nondestructive examinations of limited scope, may be based on fewer hours of training and experience than recommended in SNT-TC-1A or CP-189. Any limitations or restrictions placed upon a person's certification shall be described in the written practice and on the certification.`

import { Button } from '@/components/ui/button'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { Copy, Link, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

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
        end: index
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard')
    } catch (error) {
      console.error('Failed to copy text:', error)
      toast.error('Failed to copy text to clipboard')
    }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl">
        <div className="prose dark:prose-invert">
          {sections.map((section, index) => (
            <div key={index} className="group relative">
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
              <div
                onClick={() => setSelectedSection(section)}
                role="button"
                tabIndex={0}
              >
                <MemoizedReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                  className="prose-sm group-hover:bg-muted p-4 rounded-lg"
                >
                  {section.content.trim()}
                </MemoizedReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

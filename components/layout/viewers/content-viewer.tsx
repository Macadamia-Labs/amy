'use client'

import { DocContent } from '@/app/(app)/resources/[id]/doc-content'
import { Section } from '@/lib/providers/document-provider'

interface ContentViewerProps {
  resource: any
  sections: Section[]
  activeSection: Section | null
}

export function ContentViewer({
  resource,
  sections,
  activeSection
}: ContentViewerProps) {
  return (
    <div className="h-full overflow-auto p-4">
      {resource?.content || (
        <DocContent sections={sections} activeSection={activeSection} />
      )}
    </div>
  )
}

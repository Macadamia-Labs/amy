'use client'

import { DocsSidebar } from '@/components/layout/docs-sidebar'
import { Section } from '@/lib/providers/document-provider'

interface SidebarProps {
  onClose: () => void
}

interface OutlineSidebarProps extends SidebarProps {
  activeSection: Section | null
  onSectionSelect: (section: Section) => void
}

export function OutlineSidebar({
  onClose,
  activeSection,
  onSectionSelect
}: OutlineSidebarProps) {
  return (
    <>
      <DocsSidebar
        onSectionSelect={onSectionSelect}
        activeSection={activeSection}
        onClose={onClose}
      />
    </>
  )
}

import { DocContent } from '@/app/(app)/resources/[id]/doc-content'
import { DocumentChat } from '@/components/chat/document-chat'
import { DocsSidebar } from '@/components/layout/docs-sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { useDocument } from '@/lib/providers/document-provider'
import { TextOutlineIcon } from '@/lib/utils/icons'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { Button } from '../ui/button'

export function DocsLayout() {
  const { sections, activeSection, setActiveSection } = useDocument()
  const chatId = useRef(nanoid()).current
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="relative h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {!isCollapsed && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <DocsSidebar
                onSectionSelect={setActiveSection}
                activeSection={activeSection}
                onClose={() => setIsCollapsed(true)}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel defaultSize={isCollapsed ? 65 : 45} minSize={30}>
          <div className="h-12 w-full border-b">
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(false)}
                className="absolute top-2 left-2 z-50 h-8 w-8 bg-background hover:bg-accent"
              >
                <TextOutlineIcon className="size-5" />
              </Button>
            )}
          </div>
          <div className="flex-1 h-full overflow-auto">
            <DocContent sections={sections} activeSection={activeSection} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={30}>
          <DocumentChat id={chatId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

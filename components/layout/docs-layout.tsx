'use client'

import { DocContent } from '@/app/(app)/resources/[id]/doc-content'
import { DocumentChat } from '@/components/chat/document-chat'
import { DocsSidebar } from '@/components/layout/docs-sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import '@/lib/pdf-setup'
import { useDocument } from '@/lib/providers/document-provider'
import { SearchIcon, TextOutlineIcon } from '@/lib/utils/icons'
import {
  CanvasLayer,
  HighlightLayer,
  Page,
  Pages,
  Root,
  Search,
  TextLayer
} from '@unriddle-ai/lector'
import { XIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { SearchUI } from '../custom-search'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const fileUrl = '/pdf/large.pdf'

export function DocsLayout() {
  const { sections, activeSection, setActiveSection, resource } = useDocument()
  const chatId = useRef(nanoid()).current
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true)

  return (
    <Root
      source={resource?.file_url || fileUrl}
      className="h-full w-full"
      loader={<div className="p-4">Loading...</div>}
    >
      <div className="relative h-full">
        <Tabs defaultValue="pdf" className="h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {!isCollapsed && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                  order={0}
                >
                  <DocsSidebar
                    onSectionSelect={setActiveSection}
                    activeSection={activeSection}
                    onClose={() => setIsCollapsed(true)}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            {!isSearchCollapsed && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                  order={0}
                >
                  <div className="h-12 w-full border-b flex justify-between items-center px-2">
                    <span className="font-medium">Search</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchCollapsed(true)}
                    >
                      <XIcon className="size-5" />
                    </Button>
                  </div>
                  <Search>
                    <SearchUI />
                  </Search>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel
              defaultSize={isCollapsed && isSearchCollapsed ? 65 : 45}
              minSize={30}
              order={1}
            >
              <div className="h-12 w-full border-b flex gap-2 px-2">
                {isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsCollapsed(false)
                      setIsSearchCollapsed(true)
                    }}
                  >
                    <TextOutlineIcon className="size-5" />
                  </Button>
                )}
                {isSearchCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchCollapsed(false)
                      setIsCollapsed(true)
                    }}
                  >
                    <SearchIcon className="size-5" />
                  </Button>
                )}
                <TabsList className="ml-auto">
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="pdf" className="h-full">
                <Pages className="p-4 w-full h-full">
                  <Page className="h-full w-full">
                    <CanvasLayer />
                    <TextLayer />
                    <HighlightLayer className="bg-yellow-200/70" />
                  </Page>
                </Pages>
              </TabsContent>
              <TabsContent value="markdown">
                <div className="flex-1 h-full overflow-auto">
                  <DocContent
                    sections={sections}
                    activeSection={activeSection}
                  />
                </div>
              </TabsContent>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={30} order={2}>
              <DocumentChat id={chatId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </Tabs>
      </div>
    </Root>
  )
}

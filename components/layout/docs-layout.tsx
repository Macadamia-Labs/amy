'use client'

import { DocContent } from '@/app/(app)/resources/[id]/doc-content'
import ResourceLoading from '@/app/(app)/resources/[id]/loading'
import { DocumentChat } from '@/components/chat/document-chat'
import { DocsSidebar } from '@/components/layout/docs-sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import '@/lib/pdf-setup'
import { useDocument } from '@/lib/providers/document-provider'
import { SearchIcon, TextOutlineIcon, ThumbnailIcon } from '@/lib/utils/icons'
import {
  CanvasLayer,
  HighlightLayer,
  Page,
  Pages,
  Root,
  Search,
  TextLayer,
  Thumbnail,
  Thumbnails
} from '@unriddle-ai/lector'
import { XIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { SearchUI } from '../custom-search'
import PageNavigationButtons from '../page-navigation-buttons'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const fileUrl = '/pdf/large.pdf'

export function DocsLayout() {
  const { sections, activeSection, setActiveSection, resource } = useDocument()
  const chatId = useRef(nanoid()).current
  const [sidebarState, setSidebarState] = useState<
    'closed' | 'outline' | 'search' | 'thumbnails'
  >('closed')

  const closeSidebar = () => setSidebarState('closed')
  const toggleOutline = () =>
    setSidebarState(state => (state === 'outline' ? 'closed' : 'outline'))
  const toggleSearch = () =>
    setSidebarState(state => (state === 'search' ? 'closed' : 'search'))
  const toggleThumbnails = () =>
    setSidebarState(state => (state === 'thumbnails' ? 'closed' : 'thumbnails'))

  return (
    <Root
      source={resource?.file_url || fileUrl}
      className="h-full w-full"
      loader={<ResourceLoading />}
    >
      <div className="relative h-full">
        <Tabs defaultValue="pdf" className="h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {sidebarState === 'outline' && (
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
                    onClose={closeSidebar}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            {sidebarState === 'search' && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                  order={0}
                >
                  <div className="h-12 w-full border-b flex justify-between items-center px-2">
                    <span className="font-medium">Search</span>
                    <Button variant="ghost" size="icon" onClick={closeSidebar}>
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
            {sidebarState === 'thumbnails' && (
              <>
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                  order={0}
                >
                  <div className="h-12 w-full border-b flex justify-between items-center px-2">
                    <span className="font-medium">Thumbnails</span>
                    <Button variant="ghost" size="icon" onClick={closeSidebar}>
                      <XIcon className="size-5" />
                    </Button>
                  </div>
                  <ScrollArea className="h-full">
                    <Thumbnails className="flex flex-col items-center py-4">
                      <Thumbnail className="w-48 transition-all hover:shadow-lg hover:outline hover:outline-gray-300" />
                    </Thumbnails>
                  </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel
              defaultSize={sidebarState === 'closed' ? 65 : 45}
              minSize={30}
              order={1}
            >
              <div className="h-12 w-full border-b flex gap-2 px-2">
                <div className="basis-1/3 flex gap-2 items-center">
                  <Button variant="ghost" size="icon" onClick={toggleOutline}>
                    <TextOutlineIcon className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleSearch}>
                    <SearchIcon className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleThumbnails}
                  >
                    <ThumbnailIcon className="size-5" />
                  </Button>
                </div>
                <div className="basis-1/3 flex justify-center items-center">
                  <PageNavigationButtons />
                </div>

                <div className="basis-1/3 flex justify-end items-center">
                  <TabsList>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <TabsContent value="pdf" className="h-full">
                <Pages className="w-full h-full dark:invert-[94%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]">
                  <Page>
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

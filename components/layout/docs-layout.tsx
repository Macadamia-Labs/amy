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
import Image from 'next/image'
import { useRef, useState } from 'react'
import { SearchUI } from '../custom-search'
import PageNavigationButtons from '../page-navigation-buttons'
import { Button } from '../ui/button'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export function DocsLayout() {
  const { sections, activeSection, setActiveSection, resource } = useDocument()
  const chatId = useRef(nanoid()).current
  const [sidebarState, setSidebarState] = useState<
    'closed' | 'outline' | 'search' | 'thumbnails'
  >('closed')
  const [activePage, setActivePage] = useState(0)
  const [showRawContent, setShowRawContent] = useState(false)

  const closeSidebar = () => setSidebarState('closed')
  const toggleOutline = () =>
    setSidebarState(state => (state === 'outline' ? 'closed' : 'outline'))
  const toggleSearch = () =>
    setSidebarState(state => (state === 'search' ? 'closed' : 'search'))
  const toggleThumbnails = () =>
    setSidebarState(state => (state === 'thumbnails' ? 'closed' : 'thumbnails'))
  const toggleRawContent = () => setShowRawContent(prev => !prev)

  const isPdf = resource?.file_type === 'pdf'
  const isImage = ['png', 'jpg', 'jpeg'].includes(resource?.file_type || '')

  // Parse PDF content if available
  const pdfContent =
    isPdf && resource?.content
      ? typeof resource.content === 'string'
        ? JSON.parse(resource.content)
        : resource.content
      : null
  const pdfPages = pdfContent?.pages || []
  const totalPages = pdfPages.length

  const renderPdfMarkdownContent = () => {
    if (!pdfContent) return null

    const currentPage = pdfPages[activePage]
    if (!currentPage) return null

    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePage(prev => Math.max(0, prev - 1))}
              disabled={activePage === 0}
            >
              Previous Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setActivePage(prev => Math.min(totalPages - 1, prev + 1))
              }
              disabled={activePage === totalPages - 1}
            >
              Next Page
            </Button>
          </div>
          <span>
            Page {activePage + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={toggleRawContent}>
            {showRawContent ? 'Rendered Markdown' : 'Raw Content'}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            {showRawContent ? (
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto whitespace-pre-wrap break-words max-w-full">
                <code className="w-full max-w-full">
                  {currentPage.markdown}
                </code>
              </pre>
            ) : (
              <MemoizedReactMarkdown className="max-w-full">
                {currentPage.markdown}
              </MemoizedReactMarkdown>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderContent = () => (
    <div className="relative h-full">
      <Tabs
        defaultValue={isPdf ? 'pdf' : isImage ? 'image' : 'content'}
        className="h-full"
      >
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
          {sidebarState === 'search' && isPdf && (
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
          {sidebarState === 'thumbnails' && isPdf && (
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
                {isPdf && (
                  <>
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
                  </>
                )}
              </div>
              <div className="basis-1/3 flex justify-center items-center">
                {isPdf && <PageNavigationButtons />}
              </div>

              <div className="basis-1/3 flex justify-end items-center">
                {isPdf && (
                  <TabsList>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                    <TabsTrigger value="markdown">Content</TabsTrigger>
                  </TabsList>
                )}
                {isImage && (
                  <TabsList>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>
                )}
                {!isPdf && !isImage && (
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>
                )}
              </div>
            </div>
            {isPdf && (
              <TabsContent value="pdf" className="h-full">
                <Pages className="w-full h-full dark:invert-[94%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]">
                  <Page>
                    <CanvasLayer />
                    <TextLayer />
                    <HighlightLayer className="bg-yellow-200/70" />
                  </Page>
                </Pages>
              </TabsContent>
            )}
            {isPdf && (
              <TabsContent value="markdown" className="h-full">
                <div className="h-full overflow-auto">
                  {resource?.content ? (
                    renderPdfMarkdownContent()
                  ) : (
                    <div className="p-4">
                      <DocContent
                        sections={sections}
                        activeSection={activeSection}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            {isImage && (
              <TabsContent value="image" className="h-full">
                <div className="flex justify-center items-center h-full p-4">
                  <div className="relative max-w-full max-h-full">
                    <Image
                      src={resource?.file_url || resource?.file_path || ''}
                      alt={resource?.title || 'Image'}
                      width={800}
                      height={600}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </TabsContent>
            )}
            {isImage && (
              <TabsContent value="content" className="h-full">
                <MemoizedReactMarkdown className="h-full overflow-auto p-4">
                  {resource?.content || ''}
                </MemoizedReactMarkdown>
              </TabsContent>
            )}
            {!isPdf && !isImage && (
              <TabsContent value="content" className="h-full">
                <div className="h-full overflow-auto p-4">
                  {resource?.content || (
                    <DocContent
                      sections={sections}
                      activeSection={activeSection}
                    />
                  )}
                </div>
              </TabsContent>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={30} order={2}>
            <DocumentChat id={chatId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  )

  if (isPdf && resource?.file_url) {
    return (
      <Root
        source={resource.file_url}
        className="h-full w-full"
        loader={<ResourceLoading />}
      >
        {renderContent()}
      </Root>
    )
  }

  return renderContent()
}

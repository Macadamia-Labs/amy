'use client'

import { DocContent } from '@/app/(app)/resources/[id]/doc-content'
import ResourceLoading from '@/app/(app)/resources/[id]/loading'
import { DocumentChat } from '@/components/chat/document-chat'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import '@/lib/pdf-setup'
import { useDocument } from '@/lib/providers/document-provider'
import { Root } from '@unriddle-ai/lector'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { MemoizedReactMarkdown } from '../ui/markdown'
import { OutlineSidebar } from './sidebars/outline-sidebar'
import { SearchSidebar } from './sidebars/search-sidebar'
import { ThumbnailsSidebar } from './sidebars/thumbnails-sidebar'
import { DocumentToolbar } from './toolbar/document-toolbar'
import { ContentViewer } from './viewers/content-viewer'
import { ImageViewer } from './viewers/image-viewer'
import { PdfMarkdownContent } from './viewers/pdf-markdown-content'
import { PdfViewer } from './viewers/pdf-viewer'

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
  const isSinglePage =
    resource?.file_type === 'image' ||
    !!(
      resource?.content &&
      Array.isArray((resource.content as any).pages) &&
      (resource.content as any).pages.length === 1
    )

  // Clean up page tags from content
  const cleanPageTags = (content: string) => {
    return content.replace(/<page number='\d+'>/g, '').replace(/<\/page>/g, '')
  }

  // Parse PDF content if available
  const pdfContent =
    isPdf && resource?.content
      ? typeof resource.content === 'string'
        ? JSON.parse(resource.content)
        : resource.content
      : null

  const renderContent = () => (
    <div className="relative h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {sidebarState === 'outline' && (
          <>
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              order={0}
            >
              <OutlineSidebar
                onClose={closeSidebar}
                activeSection={activeSection}
                onSectionSelect={setActiveSection}
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
              <SearchSidebar onClose={closeSidebar} />
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
              <ThumbnailsSidebar onClose={closeSidebar} />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel
          defaultSize={sidebarState === 'closed' ? 65 : 45}
          minSize={30}
          order={1}
        >
          <Tabs
            defaultValue={isPdf ? 'pdf' : isImage ? 'image' : 'content'}
            className="h-full"
          >
            <DocumentToolbar
              isSinglePage={isSinglePage}
              isPdf={isPdf}
              isImage={isImage}
              toggleOutline={toggleOutline}
              toggleSearch={toggleSearch}
              toggleThumbnails={toggleThumbnails}
            />

            {isPdf && (
              <TabsContent value="pdf" className="h-full">
                <PdfViewer resource={resource} />
              </TabsContent>
            )}
            {isPdf && (
              <TabsContent value="markdown" className="h-full">
                <div className="h-full overflow-auto">
                  {resource?.content ? (
                    <PdfMarkdownContent
                      pdfContent={pdfContent}
                      activePage={activePage}
                      setActivePage={setActivePage}
                      showRawContent={showRawContent}
                      toggleRawContent={toggleRawContent}
                    />
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
                <ImageViewer resource={resource} />
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
                <ContentViewer
                  resource={resource}
                  sections={sections}
                  activeSection={activeSection}
                />
              </TabsContent>
            )}
            <TabsContent value="full" className="h-full">
              <MemoizedReactMarkdown className="h-full overflow-auto p-4 whitespace-pre-wrap font-mono text-sm">
                {resource?.content_as_text
                  ? cleanPageTags(resource.content_as_text)
                  : 'No full text content available'}
              </MemoizedReactMarkdown>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={30} order={2}>
          <Tabs defaultValue="chat" className="h-full">
            {/* <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="full">Full</TabsTrigger>
            </TabsList> */}
            <TabsContent value="chat" className="h-full">
              <DocumentChat id={chatId} />
            </TabsContent>
            <TabsContent value="full" className="h-full">
              <MemoizedReactMarkdown className="h-full overflow-auto p-4 whitespace-pre-wrap font-mono text-sm">
                {resource?.content_as_text
                  ? cleanPageTags(resource.content_as_text)
                  : 'No full text content available'}
              </MemoizedReactMarkdown>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )

  if (isPdf && resource?.file_url && resource.file_url.startsWith('http')) {
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

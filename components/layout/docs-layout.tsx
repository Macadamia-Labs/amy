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
import dynamic from 'next/dynamic'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { MemoizedReactMarkdown } from '../ui/markdown'

// Dynamically import heavy components
const OutlineSidebar = dynamic(() =>
  import('./sidebars/outline-sidebar').then(mod => mod.OutlineSidebar)
)
const SearchSidebar = dynamic(() =>
  import('./sidebars/search-sidebar').then(mod => mod.SearchSidebar)
)
const ThumbnailsSidebar = dynamic(() =>
  import('./sidebars/thumbnails-sidebar').then(mod => mod.ThumbnailsSidebar)
)
const DocumentToolbar = dynamic(() =>
  import('./toolbar/document-toolbar').then(mod => mod.DocumentToolbar)
)
const ContentViewer = dynamic(() =>
  import('./viewers/content-viewer').then(mod => mod.ContentViewer)
)
const ImageViewer = dynamic(() =>
  import('./viewers/image-viewer').then(mod => mod.ImageViewer)
)
const PdfMarkdownContent = dynamic(() =>
  import('./viewers/pdf-markdown-content').then(mod => mod.PdfMarkdownContent)
)
const PdfViewer = dynamic(() =>
  import('./viewers/pdf-viewer').then(mod => mod.PdfViewer)
)

export const DocsLayout = memo(function DocsLayout() {
  const { sections, activeSection, setActiveSection, resource } = useDocument()
  const chatId = useRef(nanoid()).current
  const [sidebarState, setSidebarState] = useState<
    'closed' | 'outline' | 'search' | 'thumbnails'
  >('closed')
  const [activePage, setActivePage] = useState(0)
  const [showRawContent, setShowRawContent] = useState(false)

  const closeSidebar = useCallback(() => setSidebarState('closed'), [])
  const toggleOutline = useCallback(
    () =>
      setSidebarState(state => (state === 'outline' ? 'closed' : 'outline')),
    []
  )
  const toggleSearch = useCallback(
    () => setSidebarState(state => (state === 'search' ? 'closed' : 'search')),
    []
  )
  const toggleThumbnails = useCallback(
    () =>
      setSidebarState(state =>
        state === 'thumbnails' ? 'closed' : 'thumbnails'
      ),
    []
  )
  const toggleRawContent = useCallback(
    () => setShowRawContent(prev => !prev),
    []
  )

  const isPdf = resource?.file_type === 'pdf'
  const isImage = ['png', 'jpg', 'jpeg'].includes(resource?.file_type || '')

  // Clean up page tags from content
  const cleanPageTags = useCallback((content: string) => {
    return content.replace(/<page number='\d+'>/g, '').replace(/<\/page>/g, '')
  }, [])

  // Parse PDF content if available
  const pdfContent = useMemo(() => {
    if (!isPdf || !resource?.content) return null
    return typeof resource.content === 'string'
      ? JSON.parse(resource.content)
      : resource.content
  }, [isPdf, resource?.content])

  const renderContent = useCallback(
    () => (
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
              <DocumentToolbar
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
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={30} order={2}>
              <DocumentChat id={chatId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </Tabs>
      </div>
    ),
    [
      isPdf,
      isImage,
      sidebarState,
      resource,
      sections,
      activeSection,
      pdfContent,
      activePage,
      showRawContent,
      closeSidebar,
      setActiveSection,
      toggleOutline,
      toggleSearch,
      toggleThumbnails,
      toggleRawContent,
      cleanPageTags,
      chatId
    ]
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
})

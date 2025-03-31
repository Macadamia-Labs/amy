'use client'

import { Button } from '@/components/ui/button'
import { MemoizedReactMarkdown } from '@/components/ui/markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { CheckIcon, CopyIcon } from '@/lib/utils/icons'
import { toast } from 'sonner'

interface PdfMarkdownContentProps {
  pdfContent: any
  activePage: number
  setActivePage: (page: number) => void
  showRawContent: boolean
  toggleRawContent: () => void
}

export function PdfMarkdownContent({
  pdfContent,
  activePage,
  setActivePage,
  showRawContent,
  toggleRawContent
}: PdfMarkdownContentProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  if (!pdfContent) return null

  const pdfPages = pdfContent?.pages || []
  const totalPages = pdfPages.length
  const currentPage = pdfPages[activePage]
  if (!currentPage) return null

  // Process markdown to replace image IDs with URLs
  const processMarkdown = (markdown: string, images: any[]) => {
    let processedMarkdown = markdown
    images?.forEach(image => {
      const imageId = image.id
      const imageUrl = image.image_url
      // Replace both with and without file extension
      processedMarkdown = processedMarkdown
        .replace(`![${imageId}](${imageId})`, `![${imageId}](${imageUrl})`)
        .replace(
          `![${imageId.replace(/\.[^/.]+$/, '')}](${imageId})`,
          `![${imageId}](${imageUrl})`
        )
    })
    return processedMarkdown
  }

  const processedMarkdown = processMarkdown(
    currentPage.markdown,
    currentPage.images
  )

  const handleCopy = () => {
    copyToClipboard(processedMarkdown)
    toast.success('Content copied to clipboard')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage(Math.max(0, activePage - 1))}
            disabled={activePage === 0}
          >
            Previous Page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setActivePage(Math.min(totalPages - 1, activePage + 1))
            }
            disabled={activePage === totalPages - 1}
          >
            Next Page
          </Button>
        </div>
        <span>
          Page {activePage + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {isCopied ? (
              <>
                <CheckIcon className="size-4" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="size-4" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleRawContent}>
            {showRawContent ? 'Rendered Markdown' : 'Raw Content'}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {showRawContent ? (
            <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto whitespace-pre-wrap break-words max-w-full">
              <code className="w-full max-w-full">{processedMarkdown}</code>
            </pre>
          ) : (
            <MemoizedReactMarkdown className="max-w-full">
              {processedMarkdown}
            </MemoizedReactMarkdown>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

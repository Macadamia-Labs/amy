'use client'

import { Button } from '@/components/ui/button'
import { usePdf, usePdfJump } from '@unriddle-ai/lector'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const PageNavigationButtons = () => {
  const pages = usePdf(state => state.pdfDocumentProxy?.numPages)
  const currentPage = usePdf(state => state.currentPage)
  const [pageNumber, setPageNumber] = useState<string | number>(currentPage)
  const { jumpToPage } = usePdfJump()

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      jumpToPage(currentPage - 1, { behavior: 'auto' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < pages) {
      jumpToPage(currentPage + 1, { behavior: 'auto' })
    }
  }

  useEffect(() => {
    setPageNumber(currentPage)
  }, [currentPage])

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="size-8 rounded-lg"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={pageNumber}
          onChange={e => setPageNumber(e.target.value)}
          onBlur={e => {
            const value = Number(e.target.value)
            if (value >= 1 && value <= pages && currentPage !== value) {
              jumpToPage(value, { behavior: 'auto' })
            } else {
              setPageNumber(currentPage)
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
          className="w-12 h-7 pl-2 text-center bg-muted border-none flex items-center justify-center rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <span className="text-sm text-muted-foreground font-medium min-w-[40px]">
          of {pages || 1}
        </span>
      </div>

      <Button
        onClick={handleNextPage}
        disabled={currentPage >= pages}
        variant={'ghost'}
        aria-label="Next page"
        className="size-8 rounded-lg"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

export default PageNavigationButtons

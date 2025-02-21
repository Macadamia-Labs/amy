'use client'
// components/pdfviewer.tsx
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDF_OPTIONS = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/'
}

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1) // start on first page
  const [loading, setLoading] = useState(true)
  const [pageWidth, setPageWidth] = useState(0)

  function onDocumentLoadSuccess({
    numPages: nextNumPages
  }: {
    numPages: number
  }) {
    setNumPages(nextNumPages)
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth)
    setLoading(false)
  }

  // Go to next page
  function goToNextPage() {
    setPageNumber(prevPageNumber => prevPageNumber + 1)
  }

  function goToPreviousPage() {
    setPageNumber(prevPageNumber => prevPageNumber - 1)
  }

  return (
    <>
      <div
        hidden={loading}
        style={{ height: 'calc(100vh - 64px)' }}
        className="flex items-center"
      >
        <div
          className={`flex items-center justify-between w-full absolute z-10 px-2`}
        >
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="relative h-[calc(100vh - 64px)] px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages!}
            className="relative h-[calc(100vh - 64px)] px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-10 w-10" aria-hidden="true" />
          </button>
        </div>

        <div className="h-full flex justify-center mx-auto">
          <Document
            file={'/sample.pdf'}
            onLoadSuccess={onDocumentLoadSuccess}
            options={PDF_OPTIONS}
            renderMode="canvas"
            className=""
          >
            <Page
              className="w-full h-full"
              key={pageNumber}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              onRenderError={() => setLoading(false)}
              width={Math.max(pageWidth * 0.8, 390)}
            />
          </Document>
        </div>
      </div>
    </>
  )
}

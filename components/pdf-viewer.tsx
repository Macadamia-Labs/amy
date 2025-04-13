'use client'

import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import { useEffect, useRef, useState } from 'react'

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PDFViewerProps {
  url?: string
}

export default function PDFViewer({ url = '/sample.pdf' }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url)
        const pdf = await loadingTask.promise
        setNumPages(pdf.numPages)

        // Render first page
        const page = await pdf.getPage(pageNum)
        const canvas = canvasRef.current
        if (!canvas) return

        const viewport = page.getViewport({ scale: 1.5 })
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          }
          await page.render(renderContext)
        }
      } catch (error) {
        console.error('Error loading PDF:', error)
      }
    }

    loadPDF()
  }, [url, pageNum])

  const changePage = (offset: number) => {
    setPageNum(prevPageNum => {
      const newPageNum = prevPageNum + offset
      return Math.min(Math.max(1, newPageNum), numPages)
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="border rounded-lg shadow-lg overflow-auto">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNum <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {pageNum} of {numPages}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={pageNum >= numPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}

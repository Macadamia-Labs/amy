'use client'

import {
  CanvasLayer,
  HighlightLayer,
  Page,
  Pages,
  TextLayer
} from '@unriddle-ai/lector'

interface PdfViewerProps {
  resource: any
}

export function PdfViewer({ resource }: PdfViewerProps) {
  return (
    <Pages className="w-full h-full dark:invert-[94%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]">
      <Page>
        <CanvasLayer />
        <TextLayer />
        <HighlightLayer className="bg-yellow-200/70" />
      </Page>
    </Pages>
  )
}

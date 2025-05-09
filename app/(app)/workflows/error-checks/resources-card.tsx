'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TextFileIcon } from '@/lib/utils/icons'
import React, { useRef, useState } from 'react'

export function ResourcesCard() {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // You can add visual cues here if needed
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
      // Optionally clear the dataTransfer items
      if (e.dataTransfer.items) {
        e.dataTransfer.items.clear()
      } else {
        ;(e.dataTransfer as any).clearData()
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    // Placeholder: Log files to console.
    // In a real app, you would handle the upload process here.
    console.log(
      'Selected files:',
      Array.from(files).map(file => file.name)
    )
    // You might want to call an upload function here, e.g.:
    // uploadFiles(Array.from(files));
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="bg-muted rounded-3xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between relative pb-4">
        <CardTitle className="flex flex-row items-center">
          <TextFileIcon className="size-7 mr-3" /> Upload Files
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-full">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer h-full
            flex flex-col items-center justify-center
            transition-colors duration-200 ease-in-out
            ${
              isDraggingOver
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/50 hover:border-primary/70'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') openFileDialog()
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden  h-full"
              onChange={handleFileSelect}
              // Consider adding an 'accept' attribute for specific file types
              // accept=".pdf,.doc,.docx,.txt"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <p
                className={`text-lg font-semibold ${
                  isDraggingOver ? 'text-primary' : 'text-foreground'
                }`}
              >
                Drag & Drop files here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
              {/* You could add a list of supported file types here */}
              {/* <p className="text-xs text-muted-foreground mt-1">Supported: PDF, DOCX, TXT</p> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
